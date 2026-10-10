"use client";

import PackageEnquiryTrigger from "@/components/PackageEnquiryTrigger";
import { usePackageOptions } from "@/components/PackageOptionsProvider";
import { Card } from "@/components/ui";
import { formatCurrency } from "@/lib/format";
import { displayedPrice } from "@/lib/package-pricing";

interface PackagePriceCardProps {
  packageSlug: string;
  packages: { slug: string; name: string }[];
  durationLabel: string;
  /** Lowest per-person price across every option. */
  startingPrice: number;
  /** True when the price depends on the stay level or group size. */
  pricesVary: boolean;
}

/**
 * The price beside the page. It starts as the lowest price and then follows
 * the stay level and group size the customer picks in the options card.
 */
export default function PackagePriceCard({
  packageSlug,
  packages,
  durationLabel,
  startingPrice,
  pricesVary,
}: Readonly<PackagePriceCardProps>) {
  const { variants, variant, persons, interacted } = usePackageOptions();

  const price = displayedPrice(
    variants,
    startingPrice,
    interacted && variant ? { variantId: variant.id, persons } : null,
  );

  const message =
    interacted && variant
      ? [
          variants.length > 1
            ? `I'm interested in the ${variant.name} option.`
            : "I'm interested in this package.",
          price.persons && price.perPerson
            ? `Group of ${price.persons} at ${formatCurrency(price.perPerson)} per person.`
            : "",
        ]
          .filter(Boolean)
          .join(" ")
      : undefined;

  return (
    <Card variant="tinted" padding="lg" className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
        {price.label}
      </p>

      {/* Announced to screen readers when the choice changes the price. */}
      <div aria-live="polite" className="space-y-1">
        {price.perPerson !== null ? (
          <>
            <p className="text-3xl font-bold text-brand-ink-900">
              {price.isFrom && (
                <span className="mr-1.5 text-base font-semibold text-brand-muted-600">
                  From
                </span>
              )}
              {formatCurrency(price.perPerson)}
            </p>
            <p className="text-sm text-brand-muted-600">
              per person · {durationLabel}
            </p>
          </>
        ) : (
          <p className="text-2xl font-bold text-brand-ink-900">
            Price on request
          </p>
        )}

        {price.persons !== null && (
          <p className="text-sm text-brand-muted-600">
            For a group of {price.persons}
          </p>
        )}
        {price.hint && (
          <p className="text-xs text-brand-muted-600">{price.hint}</p>
        )}
        {!interacted && pricesVary && (
          <p className="text-xs text-brand-muted-600">
            Price depends on the stay you choose and your group size.
          </p>
        )}
      </div>

      <PackageEnquiryTrigger
        packageSlug={packageSlug}
        packages={packages}
        label="Enquire Now"
        initialMessage={message}
        initialTravelers={price.persons ?? undefined}
        variant="primary"
        size="md"
        className="mt-2 w-full"
      />
    </Card>
  );
}

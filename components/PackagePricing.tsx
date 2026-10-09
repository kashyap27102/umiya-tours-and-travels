"use client";

import { ArrowRight, BedDouble, Star } from "lucide-react";
import PackageEnquiryTrigger from "@/components/PackageEnquiryTrigger";
import { usePackageOptions } from "@/components/PackageOptionsProvider";
import { Badge, Card, CardTitle } from "@/components/ui";
import { cn } from "@/components/ui/cn";
import { formatCurrency } from "@/lib/format";

interface PackagePricingProps {
  packageSlug: string;
  packages: { slug: string; name: string }[];
}

/**
 * Stay levels (e.g. Deluxe / Premium) with their prices, then the route, then
 * the hotels. The route (places and nights) is the same whichever level is
 * chosen; the hotels and the price are what change.
 */
export default function PackagePricing({
  packageSlug,
  packages,
}: Readonly<PackagePricingProps>) {
  const { variants, variant, persons, chooseVariant, choosePersons } =
    usePackageOptions();
  if (!variant) return null;

  const hasChoice = variants.length > 1;
  const selectedTier = variant.prices.find((p) => p.persons === persons);

  // The route doesn't depend on the stay level. If the chosen level has no
  // stays entered, show the route from one that does.
  const routeStays =
    variant.stays.length > 0
      ? variant.stays
      : (variants.find((v) => v.stays.length > 0)?.stays ?? []);

  const message = [
    hasChoice
      ? `I'm interested in the ${variant.name} option.`
      : `I'm interested in this package.`,
    selectedTier
      ? `Group of ${selectedTier.persons} at ${formatCurrency(selectedTier.pricePerPerson)} per person.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card variant="elevated" padding="lg" className="space-y-7">
      <CardTitle className="text-xl">
        {hasChoice ? "Choose your stay & see pricing" : "Pricing & stays"}
      </CardTitle>

      {/* ── Stay level + price (changes with the choice) ── */}
      <div className="space-y-5">
        {hasChoice && (
          <div
            role="tablist"
            aria-label="Stay options"
            className="flex flex-wrap gap-2"
          >
            {variants.map((v) => {
              const active = v.id === variant.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  id={`variant-tab-${v.id}`}
                  aria-selected={active}
                  aria-controls={`variant-panel-${v.id}`}
                  onClick={() => chooseVariant(v.id)}
                  className={cn(
                    "cursor-pointer rounded-full border px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500",
                    active
                      ? "border-brand-blue-700 bg-brand-blue-700 text-brand-cream-100"
                      : "border-brand-blue-900/20 bg-white text-brand-ink-900 hover:border-brand-blue-700/60",
                  )}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
        )}

        <div
          role={hasChoice ? "tabpanel" : undefined}
          id={`variant-panel-${variant.id}`}
          aria-labelledby={hasChoice ? `variant-tab-${variant.id}` : undefined}
        >
          {variant.pricingMode === "flat" ? (
            variant.flatPrice !== null ? (
              <div>
                <p className="text-3xl font-bold text-brand-ink-900">
                  {formatCurrency(variant.flatPrice)}
                </p>
                <p className="text-sm text-brand-muted-600">per person</p>
              </div>
            ) : (
              <p className="text-lg font-semibold text-brand-ink-900">
                Price on request
              </p>
            )
          ) : variant.prices.length > 0 ? (
            <div className="space-y-2">
              <div className="overflow-x-auto rounded-xl border border-brand-blue-900/10">
                <table className="w-full text-sm">
                  <caption className="sr-only">
                    {variant.name} price by group size
                  </caption>
                  <thead className="bg-brand-mist-200/60 text-left text-xs uppercase tracking-wide text-brand-muted-600">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 font-semibold">
                        Group size
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold">
                        Per person
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-blue-900/10">
                    {variant.prices.map((tier) => {
                      const selected = tier.persons === persons;
                      return (
                        <tr
                          key={tier.persons}
                          aria-selected={selected}
                          onClick={() =>
                            choosePersons(selected ? null : tier.persons)
                          }
                          className={cn(
                            "cursor-pointer transition-colors",
                            selected
                              ? "bg-brand-blue-500/10"
                              : "hover:bg-brand-mist-200/40",
                          )}
                        >
                          <td className="px-4 py-3 font-medium text-brand-ink-900">
                            <label className="flex cursor-pointer items-center gap-2">
                              <input
                                type="radio"
                                name={`group-${variant.id}`}
                                checked={selected}
                                onChange={() => choosePersons(tier.persons)}
                                className="h-4 w-4 accent-brand-blue-700"
                              />
                              {tier.persons}{" "}
                              {tier.persons === 1 ? "person" : "people"}
                            </label>
                          </td>
                          <td className="px-4 py-3 font-semibold text-brand-ink-900">
                            {formatCurrency(tier.pricePerPerson)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-brand-muted-600">
                Select a group size to see its price at the top right.
                Travelling in a different group size? Enquire and we will quote
                it for you.
              </p>
            </div>
          ) : (
            <p className="text-lg font-semibold text-brand-ink-900">
              Price on request
            </p>
          )}
        </div>
      </div>

      {/* ── Route: the same for every stay level ── */}
      {routeStays.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
            Your route
          </p>
          <ol className="flex flex-wrap items-center gap-2">
            {routeStays.map((stay, index) => (
              <li key={stay.id} className="flex items-center gap-2">
                {index > 0 && (
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 text-brand-muted-600"
                  />
                )}
                <span className="flex items-center gap-2 rounded-xl border border-brand-blue-900/10 bg-white/70 px-3 py-2">
                  <span
                    aria-hidden
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue-500 text-xs font-bold text-white"
                  >
                    {index + 1}
                  </span>
                  <span className="font-semibold text-brand-ink-900">
                    {stay.destinationName}
                  </span>
                  <Badge variant="brand" size="sm">
                    {stay.nights} night{stay.nights === 1 ? "" : "s"}
                  </Badge>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── Hotels: these change with the stay level ── */}
      {variant.stays.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
            {hasChoice ? `Hotels in the ${variant.name} option` : "Hotels"}
          </p>
          <ul className="space-y-3">
            {variant.stays.map((stay) => (
              <li
                key={stay.id}
                className="rounded-xl border border-brand-blue-900/10 bg-white/70 p-4"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-brand-muted-600">
                  {stay.destinationName}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-brand-ink-900">
                    {stay.hotelName}
                  </span>
                  {stay.hotelStars ? (
                    <span
                      className="inline-flex items-center gap-0.5 text-brand-lime-400"
                      aria-label={`${stay.hotelStars}-star hotel`}
                    >
                      {Array.from({ length: stay.hotelStars }, (_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </span>
                  ) : null}
                </p>
                {stay.roomType && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-muted-600">
                    <BedDouble className="h-4 w-4 shrink-0" />
                    {stay.roomType}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <PackageEnquiryTrigger
        packageSlug={packageSlug}
        packages={packages}
        label={
          hasChoice ? `Enquire about ${variant.name}` : "Enquire about this plan"
        }
        initialMessage={message}
        initialTravelers={selectedTier?.persons}
        variant="primary"
        size="md"
        className="w-full sm:w-auto"
      />
    </Card>
  );
}

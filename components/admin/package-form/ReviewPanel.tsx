"use client";

import {
  MapPin,
  Tag,
  Calendar,
  IndianRupee,
  Star,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { computeStartingPrice } from "@/lib/package-pricing";
import {
  PACKAGE_STATUS_BADGE,
  PACKAGE_STATUS_LABEL,
} from "@/lib/package-status";
import type { PackageFormValues } from "@/schemas/package";
import type { DestinationWithHotels } from "@/services/taxonomy-service";
import type { Category } from "@/app/generated/prisma/client";

interface ReviewPanelProps {
  data: PackageFormValues;
  destinations: DestinationWithHotels[];
  categories: Category[];
  inclusions: { id: string; text: string }[];
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  highlight?: boolean;
}

function DetailItem({
  icon,
  label,
  value,
  highlight,
}: Readonly<DetailItemProps>) {
  return (
    <div className="flex gap-3">
      <div
        className={`shrink-0 ${highlight ? "text-brand-blue-600" : "text-brand-muted-600"}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
          {label}
        </dt>
        <dd
          className={`mt-0.5 ${highlight ? "text-lg font-bold text-brand-blue-900" : "text-sm font-medium text-brand-ink-900"}`}
        >
          {value || "—"}
        </dd>
      </div>
    </div>
  );
}

export function ReviewPanel({
  data: v,
  destinations,
  categories,
  inclusions,
}: Readonly<ReviewPanelProps>) {
  const textsFor = (ids: string[]) =>
    ids
      .map((id) => inclusions.find((i) => i.id === id)?.text)
      .filter((text): text is string => Boolean(text));
  const includedTexts = textsFor(v.inclusionIds);
  const excludedTexts = textsFor(v.exclusionIds);
  const destinationNames = v.destinationIds
    .map((id) => destinations.find((d) => d.id === id)?.name)
    .filter(Boolean)
    .join(" - ");
  const categoryNames = v.categoryIds
    .map((id) => categories.find((c) => c.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  const startingPrice = computeStartingPrice(
    v.variants.map((variant) => ({
      pricingMode: variant.pricingMode,
      flatPrice: variant.flatPrice,
      prices: variant.pricingMode === "group_size" ? variant.prices : [],
    })),
  );

  return (
    <Card variant="elevated" padding="lg" className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-linear-to-br bg-brand-blue-500 px-6 py-6 text-white">
        <h2 className="text-2xl font-bold">{v.name || "Package Name"}</h2>
        <p className="mt-1 text-blue-100">{destinationNames || "Destination"}</p>
      </div>

      {/* Core Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-brand-blue-900/10 pb-3">
          <FileText className="h-5 w-5 text-brand-blue-600" />
          <h3 className="text-sm font-semibold text-brand-ink-900">
            Package Details
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailItem
            icon={<Tag className="h-4 w-4" />}
            label="Categories"
            value={
              <span className="flex flex-wrap gap-1.5">
                {categoryNames.map((name) => (
                  <Badge key={name} variant="brand" size="sm">
                    {name}
                  </Badge>
                ))}
              </span>
            }
          />
          <DetailItem
            icon={
              <Badge variant={PACKAGE_STATUS_BADGE[v.status]} size="md">
                {PACKAGE_STATUS_LABEL[v.status].toUpperCase()}
              </Badge>
            }
            label="Status"
            value={
              v.status === "active"
                ? "Published"
                : v.status === "draft"
                  ? "Draft - not on the website"
                  : "Hidden from the website"
            }
          />
          <DetailItem
            icon={<Calendar className="h-4 w-4" />}
            label="Duration"
            value={`${v.durationDays}D / ${v.durationNights}N`}
            highlight
          />
          <DetailItem
            icon={<IndianRupee className="h-4 w-4" />}
            label="Starting Price Per Person"
            value={startingPrice > 0 ? `₹${startingPrice.toLocaleString("en-IN")}` : "—"}
            highlight
          />
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-4 border-t border-brand-blue-900/10 pt-4">
        <div className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-brand-blue-600" />
          <h3 className="text-sm font-semibold text-brand-ink-900">
            Variants & Pricing
          </h3>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {v.variants.map((variant, i) => (
            <div
              key={i}
              className="space-y-2 rounded-lg bg-brand-mist-200/40 p-3"
            >
              <p className="font-semibold text-brand-ink-900">
                {variant.name || "Unnamed variant"}
              </p>
              {variant.pricingMode === "flat" ? (
                <p className="text-sm text-brand-ink-900">
                  {variant.flatPrice
                    ? `₹${variant.flatPrice.toLocaleString("en-IN")} per person`
                    : "—"}
                </p>
              ) : (
                <ul className="space-y-0.5 text-sm text-brand-ink-900">
                  {[...variant.prices]
                    .sort((a, b) => a.persons - b.persons)
                    .map((tier) => (
                      <li key={tier.persons}>
                        {tier.persons} persons: ₹
                        {tier.pricePerPerson.toLocaleString("en-IN")} per person
                      </li>
                    ))}
                </ul>
              )}
              {variant.stays.length > 0 && (
                <p className="text-xs text-brand-muted-600">
                  {variant.stays.reduce((n, s) => n + s.nights, 0)} nights across{" "}
                  {variant.stays.length} stay
                  {variant.stays.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-3 border-t border-brand-blue-900/10 pt-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand-blue-600" />
          <h3 className="text-sm font-semibold text-brand-ink-900">Summary</h3>
        </div>
        <p className="text-sm leading-relaxed text-brand-ink-900">
          {v.summary || "—"}
        </p>
      </div>

      {/* Highlights, Inclusions, Exclusions */}
      <div className="space-y-5 border-t border-brand-blue-900/10 pt-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-brand-lime-400" />
          <h3 className="text-sm font-semibold text-brand-ink-900">
            Features & Details
          </h3>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Highlights */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-brand-lime-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
                Highlights
              </h4>
            </div>
            <ul className="space-y-2">
              {v.highlights?.filter(Boolean).map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm text-brand-ink-900"
                >
                  <span className="shrink-0 text-brand-lime-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Inclusions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-brand-green-500" />
              <h4 className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
                Inclusions
              </h4>
            </div>
            <ul className="space-y-2">
              {includedTexts.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm text-brand-ink-900"
                >
                  <span className="shrink-0 text-brand-green-500">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <h4 className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
                Exclusions
              </h4>
            </div>
            <ul className="space-y-2">
              {excludedTexts.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm text-brand-ink-900"
                >
                  <span className="shrink-0 text-red-500">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Itinerary */}
      {v.itinerary && v.itinerary.length > 0 && (
        <div className="space-y-4 border-t border-brand-blue-900/10 pt-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-brand-blue-600" />
            <h3 className="text-sm font-semibold text-brand-ink-900">
              Itinerary
              <span className="ml-2 inline-block rounded-full bg-brand-blue-600/10 px-2 py-0.5 text-xs font-bold text-brand-blue-600">
                {v.itinerary.length} day{v.itinerary.length !== 1 ? "s" : ""}
              </span>
            </h3>
          </div>
          <ol className="space-y-3">
            {v.itinerary.map((day, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-lg bg-brand-mist-200/40 p-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue-500 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-ink-900">
                    {day.title || (
                      <span className="italic text-brand-muted-600">
                        Untitled Day
                      </span>
                    )}
                  </p>
                  {day.description && (
                    <p className="mt-1 text-sm text-brand-muted-600 line-clamp-3">
                      {day.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
}

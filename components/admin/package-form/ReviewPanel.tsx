"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";
import { Badge, Card, CardTitle } from "@/components/ui";
import type { PackageFormValues } from "@/lib/schemas/package";

interface ReviewPanelProps {
  form: UseFormReturn<PackageFormValues>;
}

export function ReviewPanel({ form }: ReviewPanelProps) {
  const v = useWatch({ control: form.control }) as PackageFormValues;

  return (
    <Card variant="elevated" padding="lg" className="space-y-5">
      <CardTitle className="text-base">Review Before Submitting</CardTitle>

      {/* Core details */}
      <dl className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
        {[
          { label: "Package Name", value: v.name },
          { label: "Destination", value: v.destination },
          { label: "Category", value: v.category },
          {
            label: "Duration",
            value: v.durationDays
              ? `${v.durationDays}D / ${v.durationNights ?? 0}N`
              : "—",
          },
          {
            label: "Price / Person",
            value: v.pricePerPerson
              ? `₹${Number(v.pricePerPerson).toLocaleString("en-IN")}`
              : "—",
          },
        ].map(({ label, value }) => (
          <div key={label}>
            <dt className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
              {label}
            </dt>
            <dd className="font-medium text-brand-ink-900">{value || "—"}</dd>
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
            Status
          </dt>
          <dd>
            <Badge
              variant={v.status === "active" ? "success" : "outline"}
              size="sm"
            >
              {v.status ?? "—"}
            </Badge>
          </dd>
        </div>

        <div className="sm:col-span-2">
          <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
            Summary
          </dt>
          <dd className="text-brand-ink-900">{v.summary || "—"}</dd>
        </div>

        <div className="sm:col-span-2">
          <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
            Highlights
          </dt>
          <dd className="text-brand-ink-900">
            {v.highlights?.filter(Boolean).join(" · ") || "—"}
          </dd>
        </div>
      </dl>

      {/* Itinerary */}
      {v.itinerary && v.itinerary.length > 0 && (
        <div className="space-y-2 border-t border-brand-blue-900/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
            Itinerary ({v.itinerary.length} day{v.itinerary.length !== 1 ? "s" : ""})
          </p>
          <ol className="space-y-3">
            {v.itinerary.map((day, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue-600/10 text-xs font-bold text-brand-blue-600">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-ink-900">
                    {day.title || <span className="italic text-brand-muted-600">Untitled</span>}
                  </p>
                  {day.description && (
                    <p className="mt-0.5 text-xs text-brand-muted-600 line-clamp-2">
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

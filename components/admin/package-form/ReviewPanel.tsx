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
import type { PackageFormValues } from "@/schemas/package";

interface ReviewPanelProps {
  data: PackageFormValues;
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

export function ReviewPanel({ data: v }: Readonly<ReviewPanelProps>) {
  return (
    <Card variant="elevated" padding="lg" className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-linear-to-br bg-brand-blue-500 px-6 py-6 text-white">
        <h2 className="text-2xl font-bold">{v.name || "Package Name"}</h2>
        <p className="mt-1 text-blue-100">{v.destination || "Destination"}</p>
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
            label="Category"
            value={
              <Badge variant="brand" size="sm">
                {v.category}
              </Badge>
            }
          />
          <DetailItem
            icon={
              <Badge
                variant={v.status === "active" ? "success" : "outline"}
                size="md"
              >
                {v.status?.toUpperCase()}
              </Badge>
            }
            label="Status"
            value={v.status === "active" ? "Published" : "Draft"}
          />
          <DetailItem
            icon={<Calendar className="h-4 w-4" />}
            label="Duration"
            value={`${v.durationDays}D / ${v.durationNights}N`}
            highlight
          />
          <DetailItem
            icon={<IndianRupee className="h-4 w-4" />}
            label="Price Per Person"
            value={`₹${Number(v.pricePerPerson).toLocaleString("en-IN")}`}
            highlight
          />
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
              {v.inclusions?.filter(Boolean).map((item) => (
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
              {v.exclusions?.filter(Boolean).map((item) => (
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

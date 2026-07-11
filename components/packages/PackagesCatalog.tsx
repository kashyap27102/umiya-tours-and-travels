"use client";

import { useMemo, useState } from "react";
import PackageCard from "@/components/PackageCard";
import { Badge, cn, Select } from "@/components/ui";
import {
  PACKAGE_CATEGORIES,
  PACKAGE_DURATION_BUCKETS,
  PACKAGE_SORT_OPTIONS,
  PACKAGE_STATUS_OPTIONS,
  type PackageDurationBucket,
  type PackageSortOption,
  type PackageStatus,
} from "@/lib/packages-constants";
import type { TravelPackage } from "@/lib/packages-data";

interface PackagesCatalogProps {
  packages: TravelPackage[];
  header?: React.ReactNode;
  compactCards?: boolean;
}

const sortLabels: Record<PackageSortOption, string> = {
  popular: "Most Popular",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "duration-asc": "Duration: Shortest",
  "duration-desc": "Duration: Longest",
};

const matchesDuration = (
  days: number,
  bucket: PackageDurationBucket | "all",
) => {
  if (bucket === "all") {
    return true;
  }

  if (bucket === "1-3") {
    return days >= 1 && days <= 3;
  }
  if (bucket === "4-6") {
    return days >= 4 && days <= 6;
  }
  if (bucket === "7-10") {
    return days >= 7 && days <= 10;
  }

  return days >= 11;
};

export default function PackagesCatalog({
  packages,
  header,
  compactCards,
}: Readonly<PackagesCatalogProps>) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | (typeof PACKAGE_CATEGORIES)[number]
  >("all");
  const [selectedDuration, setSelectedDuration] = useState<
    "all" | PackageDurationBucket
  >("all");
  const [sortBy, setSortBy] = useState<PackageSortOption>("popular");
  const [selectedStatus, setSelectedStatus] = useState<"all" | PackageStatus>(
    "all",
  );

  const filteredPackages = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    const filtered = packages.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm) ||
        item.destination.toLowerCase().includes(searchTerm) ||
        item.highlights.join(" ").toLowerCase().includes(searchTerm);

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const durationOk = matchesDuration(item.durationDays, selectedDuration);
      const statusOk =
        !compactCards ||
        selectedStatus === "all" ||
        item.status === selectedStatus;

      return matchesSearch && matchesCategory && durationOk && statusOk;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortBy === "popular") {
        return b.popularityScore - a.popularityScore;
      }
      if (sortBy === "price-asc") {
        return a.pricePerPerson - b.pricePerPerson;
      }
      if (sortBy === "price-desc") {
        return b.pricePerPerson - a.pricePerPerson;
      }
      if (sortBy === "duration-asc") {
        return a.durationDays - b.durationDays;
      }
      return b.durationDays - a.durationDays;
    });

    return sorted;
  }, [
    packages,
    query,
    selectedCategory,
    selectedDuration,
    selectedStatus,
    sortBy,
    compactCards,
  ]);

  return (
    <section className="space-y-7">
      {header}

      <div
        className={cn(
          "grid gap-4 rounded-3xl border border-brand-blue-900/10 bg-white/85 p-5 shadow-[0_8px_28px_rgb(var(--brand-blue-rgb)/0.08)] md:grid-cols-2",
          compactCards ? "lg:grid-cols-5" : "lg:grid-cols-4",
        )}
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
            Search Destination
          </span>
          <input
            type="text"
            placeholder="Goa, Dubai, Manali..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-h-11 rounded-xl border border-brand-blue-900/20 bg-white px-3.5 text-sm text-brand-ink-900 outline-none transition-all focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-500/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
            Category
          </span>
          <Select
            value={selectedCategory}
            onChange={(next) =>
              setSelectedCategory(
                next as "all" | (typeof PACKAGE_CATEGORIES)[number],
              )
            }
            options={[
              { label: "All Categories", value: "all" },
              ...PACKAGE_CATEGORIES.map((option) => ({
                label: option,
                value: option,
              })),
            ]}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
            Duration
          </span>
          <Select
            value={selectedDuration}
            onChange={(next) =>
              setSelectedDuration(next as "all" | PackageDurationBucket)
            }
            options={[
              { label: "Any Duration", value: "all" },
              ...PACKAGE_DURATION_BUCKETS.map((option) => ({
                label: `${option} Days`,
                value: option,
              })),
            ]}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
            Sort By
          </span>
          <Select
            value={sortBy}
            onChange={(next) => setSortBy(next as PackageSortOption)}
            options={PACKAGE_SORT_OPTIONS.map((option) => ({
              label: sortLabels[option],
              value: option,
            }))}
          />
        </label>

        {compactCards && (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
              Status
            </span>
            <Select
              value={selectedStatus}
              onChange={(next) =>
                setSelectedStatus(next as "all" | PackageStatus)
              }
              options={[
                { label: "All Status", value: "all" },
                ...PACKAGE_STATUS_OPTIONS.map((option) => ({
                  label: option.charAt(0).toUpperCase() + option.slice(1),
                  value: option,
                })),
              ]}
            />
          </label>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-muted-600">
          Showing{" "}
          <span className="font-semibold text-brand-ink-900">
            {filteredPackages.length}
          </span>{" "}
          of {packages.length} packages
        </p>
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== "all" && (
            <Badge variant="brand" size="sm">
              {selectedCategory}
            </Badge>
          )}
          {selectedDuration !== "all" && (
            <Badge variant="brand" size="sm">
              {selectedDuration} Days
            </Badge>
          )}
          {selectedStatus !== "all" && (
            <Badge
              variant={selectedStatus === "active" ? "success" : "outline"}
              size="sm"
            >
              {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
            </Badge>
          )}
        </div>
      </div>

      {filteredPackages.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-brand-blue-900/25 bg-white/60 px-6 py-12 text-center">
          <h3 className="text-2xl font-semibold text-brand-ink-900">
            No Packages Match Your Filters
          </h3>
          <p className="mt-2 text-brand-muted-600">
            Try changing destination keywords, category, or duration to discover
            more options.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPackages.map((item) => (
            <PackageCard key={item.slug} item={item} compact={compactCards} />
          ))}
        </div>
      )}
    </section>
  );
}

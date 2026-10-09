"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input, Select } from "@/components/ui";
import type { SelectOption } from "@/components/ui";
import { PACKAGE_STATUS_OPTIONS } from "@/lib/packages-constants";
import { PACKAGE_STATUS_LABEL } from "@/lib/package-status";
import { useUrlSearch } from "@/hooks/useUrlSearch";

const ALL = "all";

const statusOptions: SelectOption[] = [
  { label: "All Statuses", value: ALL },
  ...PACKAGE_STATUS_OPTIONS.map((s) => ({
    label: PACKAGE_STATUS_LABEL[s],
    value: s,
  })),
];

interface AdminPackageFiltersProps {
  destinations: { slug: string; name: string; country: string }[];
  categories: { slug: string; name: string }[];
}

export default function AdminPackageFilters({
  destinations,
  categories,
}: Readonly<AdminPackageFiltersProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const destinationOptions: SelectOption[] = [
    { label: "All Destinations", value: ALL },
    ...destinations.map((d) => ({
      label: `${d.name} (${d.country})`,
      value: d.slug,
    })),
  ];
  const categoryOptions: SelectOption[] = [
    { label: "All Categories", value: ALL },
    ...categories.map((c) => ({ label: c.name, value: c.slug })),
  ];

  const [query, setQuery] = useUrlSearch("search");

  const destination = searchParams.get("destination") ?? ALL;
  // Slugs are lowercase; older links used names like "Beach".
  const category = (searchParams.get("category") ?? ALL).toLowerCase();
  const status = searchParams.get("status") ?? ALL;

  function pushParams(updates: Record<string, string>) {
    // Read the live URL so a pending search update can't overwrite a filter
    // that was changed in the meantime.
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === ALL) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    // Reset to page 1 on filter change
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          placeholder="Search by name or destination…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setQuery("");
          }}
          aria-label="Search packages"
          leftIcon={
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          }
        />
      </div>
      <Select
        options={destinationOptions}
        value={destination}
        onChange={(val) => pushParams({ destination: val })}
        placeholder="Destination"
        className="w-full sm:w-52"
      />
      <Select
        options={categoryOptions}
        value={category}
        onChange={(val) => pushParams({ category: val })}
        placeholder="Category"
        className="w-full sm:w-48"
      />
      <Select
        options={statusOptions}
        value={status}
        onChange={(val) => pushParams({ status: val })}
        placeholder="Status"
        className="w-full sm:w-40"
      />
    </div>
  );
}

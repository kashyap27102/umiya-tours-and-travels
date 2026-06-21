"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input, Select } from "@/components/ui";
import type { SelectOption } from "@/components/ui";
import {
  PACKAGE_CATEGORIES,
  PACKAGE_STATUS_OPTIONS,
} from "@/lib/packages-constants";

const ALL = "all";

const categoryOptions: SelectOption[] = [
  { label: "All Categories", value: ALL },
  ...PACKAGE_CATEGORIES.map((c) => ({ label: c, value: c })),
];

const statusOptions: SelectOption[] = [
  { label: "All Statuses", value: ALL },
  ...PACKAGE_STATUS_OPTIONS.map((s) => ({
    label: s.charAt(0).toUpperCase() + s.slice(1),
    value: s,
  })),
];

export default function AdminPackageFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? ALL;
  const status = searchParams.get("status") ?? ALL;

  function pushParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
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
          defaultValue={search}
          onChange={(e) => pushParams({ search: e.target.value })}
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

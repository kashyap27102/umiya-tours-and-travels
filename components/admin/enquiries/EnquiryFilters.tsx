"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input, Select } from "@/components/ui";
import type { SelectOption } from "@/components/ui";
import { useUrlSearch } from "@/hooks/useUrlSearch";

const ALL = "all";

const TYPE_OPTIONS: SelectOption[] = [
  { label: "All types", value: ALL },
  { label: "Package enquiries", value: "package" },
  { label: "Vehicle bookings", value: "vehicle" },
  { label: "General contact", value: "contact" },
];

export default function EnquiryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useUrlSearch("search");
  const type = searchParams.get("type") ?? ALL;

  function changeType(value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value === ALL) params.delete("type");
    else params.set("type", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          placeholder="Search by name, phone, email, message or package…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setQuery("");
          }}
          aria-label="Search enquiries"
        />
      </div>
      <Select
        options={TYPE_OPTIONS}
        value={type}
        onChange={changeType}
        className="w-full sm:w-52"
      />
    </div>
  );
}

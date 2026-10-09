"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Select } from "@/components/ui";
import type { SelectOption } from "@/components/ui";
import { ADMIN_PACKAGE_PAGE_SIZES } from "@/lib/packages-constants";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

const PAGE_SIZE_OPTIONS: SelectOption[] = ADMIN_PACKAGE_PAGE_SIZES.map((n) => ({
  label: `${n} per page`,
  value: String(n),
}));

export default function AdminPagination({
  page,
  totalPages,
  total,
  pageSize,
}: Readonly<AdminPaginationProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  function goToPage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  function changePageSize(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", value);
    // The old page number may not exist at the new size.
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          options={PAGE_SIZE_OPTIONS}
          value={String(pageSize)}
          onChange={changePageSize}
          className="w-36"
        />
        <p className="text-xs text-brand-muted-600">
          Showing {from}–{to} of {total} packages
        </p>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium text-brand-ink-900">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

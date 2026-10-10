import { Suspense } from "react";
import Link from "next/link";
import AdminPagination from "@/components/admin/AdminPagination";
import EnquiryFilters from "@/components/admin/enquiries/EnquiryFilters";
import EnquiryTable from "@/components/admin/enquiries/EnquiryTable";
import { cn } from "@/components/ui";
import {
  ENQUIRY_PAGE_SIZES,
  ENQUIRY_STATUS_LABEL,
  ENQUIRY_STATUSES,
  isStatus,
} from "@/lib/enquiry-constants";
import { EnquiryService } from "@/services/enquiry-service";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    type?: string;
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function AdminEnquiriesPage({
  searchParams,
}: Readonly<PageProps>) {
  const params = await searchParams;
  const page = Math.max(1, Math.trunc(Number(params.page ?? 1)) || 1);
  const requestedSize = Number(params.pageSize);
  const pageSize = (ENQUIRY_PAGE_SIZES as readonly number[]).includes(requestedSize)
    ? requestedSize
    : ENQUIRY_PAGE_SIZES[0];
  const activeStatus = isStatus(params.status) ? params.status : null;

  const [result, counts] = await Promise.all([
    EnquiryService.list({
      status: params.status,
      type: params.type,
      search: params.search,
      page,
      pageSize,
    }),
    EnquiryService.countsByStatus(),
  ]);
  const totalAll = ENQUIRY_STATUSES.reduce((sum, s) => sum + counts[s], 0);

  // Status chips keep the other filters but reset to page 1.
  function chipHref(status: string | null) {
    const next = new URLSearchParams();
    if (status) next.set("status", status);
    if (params.type) next.set("type", params.type);
    if (params.search) next.set("search", params.search);
    if (params.pageSize) next.set("pageSize", params.pageSize);
    const query = next.toString();
    return query ? `/admin/enquiries?${query}` : "/admin/enquiries";
  }

  const chips = [
    { status: null, label: "All", count: totalAll },
    ...ENQUIRY_STATUSES.map((s) => ({
      status: s as string,
      label: ENQUIRY_STATUS_LABEL[s],
      count: counts[s],
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
          Enquiries
        </h1>
        <p className="text-sm text-brand-muted-600">
          Everything customers send from the contact, package and vehicle
          forms. Open one to call, WhatsApp or email, then track it from New to
          Booked.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const active = chip.status === activeStatus;
          return (
            <Link
              key={chip.label}
              href={chipHref(chip.status)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-brand-blue-700 bg-brand-blue-700 text-white!"
                  : "border-brand-blue-900/15 bg-white text-brand-ink-900 hover:border-brand-blue-500",
              )}
            >
              {chip.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-brand-mist-200 text-brand-muted-600",
                )}
              >
                {chip.count}
              </span>
            </Link>
          );
        })}
      </div>

      <Suspense>
        <EnquiryFilters />
      </Suspense>

      <EnquiryTable items={result.items} />

      <Suspense>
        <AdminPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          pageSize={result.pageSize}
          itemLabel="enquiries"
          pageSizes={ENQUIRY_PAGE_SIZES}
        />
      </Suspense>
    </div>
  );
}

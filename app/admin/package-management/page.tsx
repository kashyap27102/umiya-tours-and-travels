import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import AdminPackageTable from "@/components/admin/AdminPackageTable";
import AdminPackageFilters from "@/components/admin/AdminPackageFilters";
import AdminPagination from "@/components/admin/AdminPagination";
import { PackageService, TaxonomyService } from "@/services";
import {
  ADMIN_PACKAGE_PAGE_SIZES,
  DEFAULT_ADMIN_PACKAGE_PAGE_SIZE,
} from "@/lib/packages-constants";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    destination?: string;
    category?: string;
    status?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function AdminPackageManagementPage({
  searchParams,
}: Readonly<PageProps>) {
  const params = await searchParams;

  const page = Math.max(1, Math.trunc(Number(params.page ?? 1)) || 1);
  const requestedSize = Number(params.pageSize);
  const pageSize = (ADMIN_PACKAGE_PAGE_SIZES as readonly number[]).includes(
    requestedSize,
  )
    ? requestedSize
    : DEFAULT_ADMIN_PACKAGE_PAGE_SIZE;
  const [result, destinations, categories] = await Promise.all([
    PackageService.getPackages({
      search: params.search,
      destination: params.destination,
      category: params.category,
      status: params.status,
      page,
      pageSize,
    }),
    TaxonomyService.getDestinations(),
    TaxonomyService.getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
            Package Management
          </h1>
          <p className="text-sm text-brand-muted-600">
            Browse, search, and filter all travel packages.
          </p>
        </div>
        <Link href="/admin/package-management/create">
          <Button variant="primary" size="md">
            Create Package
          </Button>
        </Link>
      </div>

      <Suspense>
        <AdminPackageFilters
          destinations={
            destinations.success
              ? destinations.data.map(({ slug, name, country }) => ({
                  slug,
                  name,
                  country,
                }))
              : []
          }
          categories={
            categories.success
              ? categories.data.map(({ slug, name }) => ({ slug, name }))
              : []
          }
        />
      </Suspense>

      {result.success ? (
        <>
          <p className="text-xs text-brand-muted-600">
            {result.data.total} package{result.data.total === 1 ? "" : "s"}{" "}
            found
          </p>
          <AdminPackageTable
            packages={result.data.packages}
            startIndex={(result.data.page - 1) * result.data.pageSize}
          />
          <Suspense>
            <AdminPagination
              page={result.data.page}
              totalPages={result.data.totalPages}
              total={result.data.total}
              pageSize={result.data.pageSize}
            />
          </Suspense>
        </>
      ) : (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
          <p className="text-sm font-medium text-red-700">
            Failed to load packages: {result.error}
          </p>
        </div>
      )}
    </div>
  );
}

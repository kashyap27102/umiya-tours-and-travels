import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import AdminPackageTable from "@/components/admin/AdminPackageTable";
import AdminPackageFilters from "@/components/admin/AdminPackageFilters";
import AdminPagination from "@/components/admin/AdminPagination";
import { PackageService } from "@/services";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminPackageManagementPage({
  searchParams,
}: Readonly<PageProps>) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page ?? 1));
  const result = await PackageService.getPackages({
    search: params.search,
    category: params.category,
    status: params.status,
    page,
    pageSize: 10,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
            Package Management
          </h1>
          <p className="text-sm text-brand-muted-600">
            Browse, search, and filter all published travel packages.
          </p>
        </div>
        <Link href="/admin/package-management/create">
          <Button variant="primary" size="md">
            Create Package
          </Button>
        </Link>
      </div>

      <Suspense>
        <AdminPackageFilters />
      </Suspense>

      {result.success ? (
        <>
          <p className="text-xs text-brand-muted-600">
            {result.data.total} package{result.data.total === 1 ? "" : "s"}{" "}
            found
          </p>
          <AdminPackageTable
            packages={result.data.packages}
            startIndex={(page - 1) * 10}
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

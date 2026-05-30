import Link from "next/link";
import { Button } from "@/components/ui";
import PackagesCatalog from "@/components/packages/PackagesCatalog";
import { travelPackages } from "@/lib/packages-data";

export default function AdminPackageManagementPage() {
  return (
    <PackagesCatalog
      packages={travelPackages}
      compactCards
      header={
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
      }
    />
  );
}

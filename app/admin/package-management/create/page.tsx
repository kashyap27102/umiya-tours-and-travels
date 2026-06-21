"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import PackageForm from "@/components/admin/PackageForm";
import { usePackageForm } from "@/hooks/usePackageForm";
import { usePackageSubmit } from "@/hooks/usePackageSubmit";
import type { PackageFormValues } from "@/schemas/package";

export default function CreatePackagePage() {
  const hookResult = usePackageForm();
  const { isSubmitting, handleCreate } = usePackageSubmit();

  const handleValidSubmit = async (data: PackageFormValues) => {
    await handleCreate(data, {
      onSuccess: () => hookResult.form.reset(),
      shouldRedirect: true,
      redirectPath: "/admin/package-management",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
            Create New Package
          </h1>
          <p className="text-sm text-brand-muted-600">
            Add a new travel package to the public catalog.
          </p>
        </div>
        <Link href="/admin/package-management">
          <Button variant="outline" size="sm">
            ← Back to Packages
          </Button>
        </Link>
      </div>

      <PackageForm
        {...hookResult}
        submitLabel="Create Package"
        onValidSubmit={handleValidSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

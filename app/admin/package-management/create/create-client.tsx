"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import PackageForm from "@/components/admin/PackageForm";
import { usePackageForm } from "@/hooks/usePackageForm";
import { usePackageSubmit } from "@/hooks/usePackageSubmit";
import type { PackageFormValues } from "@/schemas/package";
import { ChevronLeft } from "lucide-react";
import type { DestinationWithHotels } from "@/services/taxonomy-service";
import type { Category } from "@/app/generated/prisma/client";

export default function CreatePackageClient({
  destinations,
  categories,
}: Readonly<{
  destinations: DestinationWithHotels[];
  categories: Category[];
}>) {
  const hookResult = usePackageForm();
  const { isSubmitting, handleCreate, handleEdit, saveDraft } =
    usePackageSubmit();
  // Set after the first "Save draft"; later saves update this package instead
  // of creating a copy.
  const [savedId, setSavedId] = useState<string | null>(null);

  const finishOptions = {
    onSuccess: () => hookResult.resetAll(),
    shouldRedirect: true,
    redirectPath: "/admin/package-management",
  };

  const handleValidSubmit = async (data: PackageFormValues) => {
    if (savedId) {
      await handleEdit(savedId, data, finishOptions);
    } else {
      await handleCreate(data, finishOptions);
    }
  };

  const handleSaveDraft = async (data: PackageFormValues) => {
    const id = await saveDraft(data, savedId);
    if (id) setSavedId(id);
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
          {savedId && (
            <p className="text-xs font-medium text-brand-green-700">
              Draft saved. You can leave and finish it later from the package
              list.
            </p>
          )}
        </div>
        <Link href="/admin/package-management">
          <Button variant="outline">
            <ChevronLeft />
            Back
          </Button>
        </Link>
      </div>

      <PackageForm
        {...hookResult}
        destinations={destinations}
        categories={categories}
        onSaveDraft={handleSaveDraft}
        submitLabel="Create Package"
        onValidSubmit={handleValidSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

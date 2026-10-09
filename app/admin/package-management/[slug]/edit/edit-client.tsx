"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { AlertDialog } from "@/components/ui/AlertDialog";
import PackageForm from "@/components/admin/PackageForm";
import { usePackageForm } from "@/hooks/usePackageForm";
import { usePackageSubmit } from "@/hooks/usePackageSubmit";
import {
  PACKAGE_STATUS_BADGE,
  PACKAGE_STATUS_LABEL,
} from "@/lib/package-status";
import type { PackageFormValues } from "@/schemas/package";
import type { PackageForEdit } from "@/types/package";
import type { DestinationWithHotels } from "@/services/taxonomy-service";
import type { Category } from "@/app/generated/prisma/client";

interface EditPackageClientProps {
  package: PackageForEdit;
  destinations: DestinationWithHotels[];
  categories: Category[];
  inclusions: { id: string; text: string }[];
}

function toFormValues(pkg: PackageForEdit): Partial<PackageFormValues> {
  return {
    name: pkg.name,
    destinationIds: pkg.destinations.map((d) => d.destinationId),
    categoryIds: pkg.categories.map((c) => c.categoryId),
    status: pkg.status,
    durationDays: pkg.durationDays,
    durationNights: pkg.durationNights,
    // A draft may have no variants yet; leaving this undefined gives the form
    // its default empty "Standard" variant.
    variants:
      pkg.variants.length === 0
        ? undefined
        : pkg.variants.map((v) => ({
            name: v.name,
            pricingMode: v.pricingMode,
            flatPrice: v.flatPrice,
            prices: v.prices.map((p) => ({
              persons: p.persons,
              pricePerPerson: p.pricePerPerson,
            })),
            stays: v.stays.map((s) => ({
              destinationId: s.destinationId,
              hotelId: s.hotelId,
              nights: s.nights,
              roomType: s.roomType ?? "",
            })),
          })),
    images: pkg.images,
    summary: pkg.summary,
    highlights: pkg.highlights.length > 0 ? pkg.highlights : [""],
    inclusionIds: pkg.inclusionLinks
      .filter((l) => l.type === "included")
      .map((l) => l.inclusionId),
    exclusionIds: pkg.inclusionLinks
      .filter((l) => l.type === "excluded")
      .map((l) => l.inclusionId),
    itinerary:
      pkg.itinerary.length > 0
        ? pkg.itinerary
        : [{ day: 1, title: "", description: "" }],
  };
}

export default function EditPackageClient({
  package: pkg,
  destinations,
  categories,
  inclusions,
}: Readonly<EditPackageClientProps>) {
  const hookResult = usePackageForm(toFormValues(pkg));
  const { isSubmitting, handleEdit, saveDraft, handleDelete } =
    usePackageSubmit();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleValidSubmit = async (data: PackageFormValues) => {
    await handleEdit(pkg.id, data);
  };

  const handleSaveDraft = async (data: PackageFormValues) => {
    await saveDraft(data, pkg.id);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    await handleDelete(pkg.id, pkg.name, {
      shouldRedirect: true,
      redirectPath: "/admin/package-management",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
              Edit Package
            </h1>
            <Badge
              variant={PACKAGE_STATUS_BADGE[hookResult.step1Form.watch("status")]}
              size="md"
            >
              {PACKAGE_STATUS_LABEL[hookResult.step1Form.watch("status")]}
            </Badge>
          </div>
          <p className="text-sm text-brand-muted-600">{pkg.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isDeleting || isSubmitting}
            className="border-red-300 text-red-700 hover:bg-red-100 hover:border-red-500 hover:text-red-800"
            title="Delete package"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
          <Link href="/admin/package-management">
            <Button variant="outline">
              <ChevronLeft />
              Back
            </Button>
          </Link>
        </div>

        <AlertDialog
          open={deleteDialogOpen}
          variant="danger"
          title="Delete Package"
          description={`Are you sure you want to delete "${pkg.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialogOpen(false)}
          isLoading={isDeleting}
        />
      </div>

      <PackageForm
        {...hookResult}
        destinations={destinations}
        categories={categories}
        inclusions={inclusions}
        onSaveDraft={pkg.status === "draft" ? handleSaveDraft : undefined}
        submitLabel="Save Changes"
        onValidSubmit={handleValidSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

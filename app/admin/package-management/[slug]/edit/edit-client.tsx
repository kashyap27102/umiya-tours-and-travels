"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { AlertDialog } from "@/components/ui/AlertDialog";
import PackageForm from "@/components/admin/PackageForm";
import { usePackageForm } from "@/hooks/usePackageForm";
import { usePackageSubmit } from "@/hooks/usePackageSubmit";
import type { PackageFormValues } from "@/schemas/package";
import type { PackageWithItinerary } from "@/types/package";

interface EditPackageClientProps {
  package: PackageWithItinerary;
}

function toFormValues(pkg: PackageWithItinerary): Partial<PackageFormValues> {
  return {
    name: pkg.name,
    destination: pkg.destination,
    category: pkg.category,
    status: pkg.status,
    durationDays: pkg.durationDays,
    durationNights: pkg.durationNights,
    pricePerPerson: pkg.pricePerPerson,
    image: pkg.image,
    summary: pkg.summary,
    highlights: pkg.highlights.length > 0 ? pkg.highlights : [""],
    inclusions: pkg.inclusions.length > 0 ? pkg.inclusions : [""],
    exclusions: pkg.exclusions.length > 0 ? pkg.exclusions : [""],
    itinerary:
      pkg.itinerary.length > 0
        ? pkg.itinerary
        : [{ day: 1, title: "", description: "" }],
  };
}

export default function EditPackageClient({
  package: pkg,
}: Readonly<EditPackageClientProps>) {
  const hookResult = usePackageForm(toFormValues(pkg));
  const { isSubmitting, handleEdit, handleDelete } = usePackageSubmit();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleValidSubmit = async (data: PackageFormValues) => {
    await handleEdit(pkg.id, data);
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
              variant={
                hookResult.step1Form.watch("status") === "active"
                  ? "success"
                  : "outline"
              }
              size="md"
            >
              {hookResult.step1Form.watch("status") === "active"
                ? "Active"
                : "Inactive"}
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
        submitLabel="Save Changes"
        onValidSubmit={handleValidSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

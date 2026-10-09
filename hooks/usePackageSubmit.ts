"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/notifications";
import type { PackageFormValues } from "@/schemas/package";
import {
  createPackage,
  editPackage,
  deletePackage,
} from "@/lib/actions/package-actions";

interface UsePackageSubmitOptions {
  onSuccess?: () => void;
  shouldRedirect?: boolean;
  redirectPath?: string;
}

export function usePackageSubmit() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (
    data: PackageFormValues,
    options: UsePackageSubmitOptions = {}
  ): Promise<{ id: string; slug: string } | null> => {
    if (isSubmitting) return null;
    setIsSubmitting(true);

    const normalized = {
      ...data,
      itinerary: data.itinerary.map((item, i) => ({ ...item, day: i + 1 })),
    };

    try {
      const result = await createPackage(normalized);

      if (result.success) {
        notify.success(
          `Package "${data.name}" created successfully!`,
          options.shouldRedirect ? "Redirecting you to the package list..." : undefined
        );
        options.onSuccess?.();
        if (options.shouldRedirect) {
          setTimeout(
            () => router.push(options.redirectPath || "/admin/package-management"),
            1000
          );
        }
        return result.data;
      }
      notify.error("Failed to create package", result.error);
      setIsSubmitting(false);
      return null;
    } catch (error) {
      notify.error(
        "Error creating package",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setIsSubmitting(false);
      return null;
    }
  };

  const handleEdit = async (
    packageId: string,
    data: PackageFormValues,
    options: UsePackageSubmitOptions = {}
  ) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const normalized = {
      ...data,
      itinerary: data.itinerary.map((item, i) => ({ ...item, day: i + 1 })),
    };

    try {
      const result = await editPackage(packageId, normalized);

      if (result.success) {
        notify.success(`Package "${data.name}" updated successfully!`);
        options.onSuccess?.();
        if (options.shouldRedirect) {
          // Keep the button disabled while we navigate away.
          setTimeout(
            () => router.push(options.redirectPath || "/admin/package-management"),
            1000
          );
        } else {
          setIsSubmitting(false);
        }
      } else {
        notify.error("Failed to update package", result.error);
        setIsSubmitting(false);
      }
    } catch (error) {
      notify.error(
        "Error updating package",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setIsSubmitting(false);
    }
  };

  /**
   * Saves the form as a draft. Creates the package the first time and updates
   * the same one afterwards (pass the id it returned). Never redirects, so the
   * user can keep working.
   */
  const saveDraft = async (
    data: PackageFormValues,
    existingId?: string | null
  ): Promise<string | null> => {
    if (isSubmitting) return null;
    setIsSubmitting(true);

    const payload: PackageFormValues = {
      ...data,
      status: "draft",
      itinerary: data.itinerary.map((item, i) => ({ ...item, day: i + 1 })),
    };

    try {
      const result = existingId
        ? await editPackage(existingId, payload)
        : await createPackage(payload);

      if (result.success) {
        notify.success("Draft saved", "You can come back and finish it any time.");
        return result.data.id;
      }
      notify.error("Could not save draft", result.error);
      return null;
    } catch (error) {
      notify.error(
        "Error saving draft",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (
    packageId: string,
    packageName: string,
    options: UsePackageSubmitOptions = {}
  ) => {
    try {
      const result = await deletePackage(packageId);

      if (result.success) {
        notify.success(
          "Package deleted successfully",
          options.shouldRedirect ? "Redirecting you to the package list..." : undefined
        );
        options.onSuccess?.();
        if (options.shouldRedirect) {
          setTimeout(
            () => router.push(options.redirectPath || "/admin/package-management"),
            1000
          );
        }
      } else {
        notify.error("Failed to delete package", result.error);
      }
    } catch (error) {
      notify.error(
        "Error deleting package",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    handleCreate,
    handleEdit,
    saveDraft,
    handleDelete,
  };
}

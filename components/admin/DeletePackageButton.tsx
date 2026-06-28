"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { deletePackage } from "@/lib/actions/package-actions";
import { notify } from "@/lib/notifications";

interface DeletePackageButtonProps {
  packageId: string;
  packageName: string;
}

export default function DeletePackageButton({
  packageId,
  packageName,
}: Readonly<DeletePackageButtonProps>) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);

    try {
      const result = await deletePackage(packageId);

      if (result.success) {
        notify.success("Package deleted successfully");
        router.refresh();
      } else {
        notify.error("Failed to delete package", result.error);
        setDialogOpen(false);
      }
    } catch (error) {
      notify.error(
        "Error deleting package",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="border-red-300 text-red-700 hover:bg-red-100 hover:border-red-500 hover:text-red-800"
        title="Delete package"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog
        open={dialogOpen}
        variant="danger"
        title="Delete Package"
        description={`Are you sure you want to delete "${packageName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
        isLoading={isDeleting}
      />
    </>
  );
}

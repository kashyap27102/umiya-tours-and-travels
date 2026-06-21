"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (
      !confirm(
        `Are you sure you want to delete "${packageName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deletePackage(packageId);

      if (result.success) {
        notify.success("Package deleted successfully");
        router.refresh();
      } else {
        notify.error("Failed to delete package", result.error);
        setIsDeleting(false);
      }
    } catch (error) {
      notify.error(
        "Error deleting package",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="border-red-300 text-red-700 hover:bg-red-50"
      title={isDeleting ? "Deleting..." : "Delete package"}
    >
      {isDeleting ? "..." : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}

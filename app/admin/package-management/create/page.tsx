"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import PackageForm from "@/components/admin/PackageForm";
import { usePackageForm } from "@/hooks/usePackageForm";
import type { PackageFormValues } from "@/schemas/package";

export default function CreatePackagePage() {
  const hookResult = usePackageForm();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleValidSubmit = (data: PackageFormValues) => {
    // Normalize itinerary day numbers before saving
    const normalized = {
      ...data,
      itinerary: data.itinerary.map((item, i) => ({ ...item, day: i + 1 })),
    };

    // TODO: persist normalized to API
    console.log("Creating package:", normalized);

    setStatus("success");
    setStatusMessage(`Package "${data.name}" created successfully!`);
    hookResult.form.reset();
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

      {status === "error" && (
        <div className="rounded-xl border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700">
          {statusMessage}
        </div>
      )}
      {status === "success" && (
        <div className="rounded-xl border border-brand-green-500/30 bg-brand-green-500/10 px-4 py-3 text-sm text-brand-green-700">
          {statusMessage}
        </div>
      )}

      <PackageForm
        {...hookResult}
        submitLabel="Create Package"
        onValidSubmit={handleValidSubmit}
      />
    </div>
  );
}

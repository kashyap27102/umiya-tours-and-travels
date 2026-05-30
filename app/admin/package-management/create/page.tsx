"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import PackageForm, {
  emptyFormValues,
  type PackageFormValues,
} from "@/components/admin/PackageForm";

export default function CreatePackagePage() {
  const [values, setValues] = useState<PackageFormValues>(emptyFormValues);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const setField = <K extends keyof PackageFormValues>(
    key: K,
    value: PackageFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    setStatusMessage("");

    if (
      !values.name.trim() ||
      !values.destination.trim() ||
      !values.category ||
      !values.durationDays ||
      !values.durationNights ||
      !values.pricePerPerson ||
      !values.summary.trim()
    ) {
      setStatus("error");
      setStatusMessage("Please fill in all required fields.");
      return;
    }

    setStatus("success");
    setStatusMessage(`Package "${values.name}" created successfully!`);
    setValues(emptyFormValues);
  };

  const handleReset = () => {
    setValues(emptyFormValues);
    setStatus("idle");
    setStatusMessage("");
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
        values={values}
        onChange={setField}
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitLabel="Create Package"
      />
    </div>
  );
}

"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import PackageForm, {
  type PackageFormValues,
} from "@/components/admin/PackageForm";
import { getPackageBySlug } from "@/lib/packages-data";
import { notFound } from "next/navigation";

function toFormValues(
  pkg: NonNullable<ReturnType<typeof getPackageBySlug>>,
): PackageFormValues {
  return {
    name: pkg.name,
    destination: pkg.destination,
    category: pkg.category,
    status: pkg.status,
    durationDays: String(pkg.durationDays),
    durationNights: pkg.durationLabel.match(/^(\d+)/)?.[1] ?? "",
    pricePerPerson: String(pkg.pricePerPerson),
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

export default function EditPackagePage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = use(params);
  const pkg = getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  const [values, setValues] = useState<PackageFormValues>(() =>
    toFormValues(pkg),
  );
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

    // In a real app this would PUT/PATCH to an API
    setStatus("success");
    setStatusMessage(`Package "${values.name}" updated successfully!`);
  };

  const handleReset = () => {
    setValues(toFormValues(pkg));
    setStatus("idle");
    setStatusMessage("");
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
              variant={values.status === "active" ? "success" : "outline"}
              size="md"
            >
              {values.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-brand-muted-600">
            Editing &quot;{pkg.name}&quot;
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
        submitLabel="Save Changes"
      />
    </div>
  );
}

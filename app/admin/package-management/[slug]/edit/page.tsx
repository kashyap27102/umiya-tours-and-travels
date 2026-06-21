"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import PackageForm from "@/components/admin/PackageForm";
import { usePackageForm } from "@/hooks/usePackageForm";
import type { PackageFormValues } from "@/schemas/package";
import { getPackageBySlug } from "@/lib/packages-data";
import { notFound } from "next/navigation";

function toFormValues(
  pkg: NonNullable<ReturnType<typeof getPackageBySlug>>,
): Partial<PackageFormValues> {
  return {
    name: pkg.name,
    destination: pkg.destination,
    category: pkg.category,
    status: pkg.status,
    durationDays: pkg.durationDays,
    durationNights: Number(pkg.durationLabel.match(/^(\d+)/)?.[1] ?? "0"),
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

  const hookResult = usePackageForm(toFormValues(pkg));
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleValidSubmit = (data: PackageFormValues) => {
    const normalized = {
      ...data,
      itinerary: data.itinerary.map((item, i) => ({ ...item, day: i + 1 })),
    };

    // TODO: persist normalized to API (PUT/PATCH)
    console.log("Updating package:", normalized);

    setStatus("success");
    setStatusMessage(`Package "${data.name}" updated successfully!`);
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
                hookResult.form.watch("status") === "active"
                  ? "success"
                  : "outline"
              }
              size="md"
            >
              {hookResult.form.watch("status") === "active"
                ? "Active"
                : "Inactive"}
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
        {...hookResult}
        submitLabel="Save Changes"
        onValidSubmit={handleValidSubmit}
      />
    </div>
  );
}

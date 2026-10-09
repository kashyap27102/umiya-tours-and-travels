"use client";

import { Card, CardTitle } from "@/components/ui";
import { ReviewPanel } from "./ReviewPanel";
import type { PackageFormValues } from "@/schemas/package";
import type { DestinationWithHotels } from "@/services/taxonomy-service";
import type { Category } from "@/app/generated/prisma/client";

interface Step5ReviewProps {
  data: PackageFormValues;
  destinations: DestinationWithHotels[];
  categories: Category[];
}

export function Step5Review({
  data,
  destinations,
  categories,
}: Step5ReviewProps) {
  return (
    <div className="space-y-6">
      <Card variant="tinted" padding="md">
        <CardTitle className="text-sm">Review Your Package</CardTitle>
        <p className="mt-1 text-xs text-brand-muted-600">
          Please verify all details below before submitting.
        </p>
      </Card>

      <ReviewPanel
        data={data}
        destinations={destinations}
        categories={categories}
      />
    </div>
  );
}

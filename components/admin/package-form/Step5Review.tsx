"use client";

import { Card, CardTitle } from "@/components/ui";
import { ReviewPanel } from "./ReviewPanel";
import type { PackageFormValues } from "@/schemas/package";

interface Step5ReviewProps {
  data: PackageFormValues;
}

export function Step5Review({ data }: Step5ReviewProps) {
  return (
    <div className="space-y-6">
      <Card variant="tinted" padding="md">
        <CardTitle className="text-sm">Review Your Package</CardTitle>
        <p className="mt-1 text-xs text-brand-muted-600">
          Please verify all details below before submitting.
        </p>
      </Card>

      <ReviewPanel data={data} />
    </div>
  );
}

"use client";

import { Card, CardTitle } from "@/components/ui";
import { ReviewPanel } from "./ReviewPanel";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";

interface Step5ReviewProps {
  hook: UsePackageFormReturn;
}

export function Step5Review({ hook }: Step5ReviewProps) {
  const { form } = hook;

  return (
    <div className="space-y-6">
      <Card variant="tinted" padding="md">
        <CardTitle className="text-sm">Review Your Package</CardTitle>
        <p className="mt-1 text-xs text-brand-muted-600">
          Please verify all details below before submitting.
        </p>
      </Card>

      <ReviewPanel form={form} />
    </div>
  );
}

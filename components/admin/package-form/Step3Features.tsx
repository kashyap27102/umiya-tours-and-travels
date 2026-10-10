"use client";

import { Controller } from "react-hook-form";
import { Star, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui";
import { EditableList } from "./EditableList";
import { InclusionPicker, type InclusionOption } from "./InclusionPicker";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";

interface Props {
  hook: UsePackageFormReturn;
  inclusions: InclusionOption[];
  onInclusionCreated: (item: InclusionOption) => void;
}

export function Step3Features({
  hook,
  inclusions,
  onInclusionCreated,
}: Readonly<Props>) {
  const { control, watch, formState } = hook.step3Form;
  const inclusionIds = watch("inclusionIds");
  const exclusionIds = watch("exclusionIds");

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card variant="elevated" padding="lg">
        <EditableList
          label="Highlights"
          fieldName="highlights"
          hook={hook}
          icon={<Star className="h-4 w-4" />}
        />
      </Card>
      <Card variant="elevated" padding="lg">
        <Controller
          name="inclusionIds"
          control={control}
          render={({ field }) => (
            <InclusionPicker
              label="Inclusions"
              icon={<CheckCircle className="h-4 w-4" />}
              items={inclusions}
              value={field.value}
              otherIds={exclusionIds}
              onChange={field.onChange}
              onCreated={onInclusionCreated}
              errorMessage={formState.errors.inclusionIds?.message}
            />
          )}
        />
      </Card>
      <Card variant="elevated" padding="lg">
        <Controller
          name="exclusionIds"
          control={control}
          render={({ field }) => (
            <InclusionPicker
              label="Exclusions"
              icon={<XCircle className="h-4 w-4" />}
              items={inclusions}
              value={field.value}
              otherIds={inclusionIds}
              onChange={field.onChange}
              onCreated={onInclusionCreated}
              errorMessage={formState.errors.exclusionIds?.message}
            />
          )}
        />
      </Card>
    </div>
  );
}

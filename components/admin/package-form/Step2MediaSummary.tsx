"use client";

import { Controller } from "react-hook-form";
import { Card, CardTitle, Input, Textarea } from "@/components/ui";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";

interface Props {
  hook: UsePackageFormReturn;
}

export function Step2MediaSummary({ hook }: Props) {
  const {
    control,
    watch,
    formState: { errors },
  } = hook.form;

  return (
    <Card variant="elevated" padding="lg" className="space-y-5">
      <CardTitle className="text-lg">Media &amp; Summary</CardTitle>

      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <Input
            label="Image URL"
            placeholder="https://images.unsplash.com/..."
            variant={errors.image ? "error" : "default"}
            errorMessage={errors.image?.message}
            {...field}
          />
        )}
      />

      {watch("image") && (
        <div className="h-52 overflow-hidden rounded-xl border border-brand-blue-900/10">
          <img
            src={watch("image")}
            alt="Package preview"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      <Controller
        name="summary"
        control={control}
        render={({ field }) => (
          <div className="space-y-1">
            <Textarea
              label="Summary *"
              placeholder="A short description of the package..."
              rows={4}
              variant={errors.summary ? "error" : "default"}
              errorMessage={errors.summary?.message}
              {...field}
            />
            <p className="text-right text-xs text-brand-muted-600">
              {field.value?.length ?? 0} characters
            </p>
          </div>
        )}
      />
    </Card>
  );
}

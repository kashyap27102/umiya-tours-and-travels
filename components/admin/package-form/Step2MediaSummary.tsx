"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { Card, CardTitle, Textarea, Button } from "@/components/ui";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";
import ImageUploadModal from "./ImageUploadModal";

interface Props {
  hook: UsePackageFormReturn;
}

export function Step2MediaSummary({ hook }: Readonly<Props>) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = hook.step2Form;

  return (
    <Card variant="elevated" padding="lg" className="space-y-5">
      <CardTitle className="text-lg">Media &amp; Summary</CardTitle>

      <div className="space-y-3">
        <div className="text-sm font-medium text-brand-ink-900">Image</div>
        {watch("image") ? (
          <div className="space-y-3">
            <div
              className="bg-gray-50 rounded-xl overflow-auto border border-brand-blue-900/10 flex items-center justify-center"
              style={{ maxHeight: "800px" }}
            >
              <img
                src={watch("image")}
                alt="Package preview"
                className="w-auto h-auto max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUploadModalOpen(true)}
            >
              Change Image
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setUploadModalOpen(true)}>
            Upload Image
          </Button>
        )}
        {errors.image && (
          <p className="text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>

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

      <ImageUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={(url) => {
          setValue("image", url, { shouldValidate: true });
          setUploadModalOpen(false);
        }}
      />
    </Card>
  );
}

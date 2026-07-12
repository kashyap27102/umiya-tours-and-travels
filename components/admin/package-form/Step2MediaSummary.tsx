"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Card, CardTitle, Textarea, Button } from "@/components/ui";
import { MAX_PACKAGE_IMAGES } from "@/lib/packages-constants";
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

  const images = watch("images");

  const removeImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  return (
    <Card variant="elevated" padding="lg" className="space-y-5">
      <CardTitle className="text-lg">Media &amp; Summary</CardTitle>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-brand-ink-900">
            Images ({images.length}/{MAX_PACKAGE_IMAGES})
          </div>
          {images.length < MAX_PACKAGE_IMAGES && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUploadModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Image</span>
            </Button>
          )}
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {images.map((url, index) => (
              <div
                key={url}
                className="relative aspect-square overflow-hidden rounded-xl border border-brand-blue-900/10 bg-gray-50"
              >
                <img
                  src={url}
                  alt={`Package preview ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  title="Remove image"
                  className="absolute top-1 right-1 cursor-pointer rounded-full bg-white/90 p-1 text-red-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.images && (
          <p className="text-sm text-red-600">{errors.images.message}</p>
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
          setValue("images", [...images, url], { shouldValidate: true });
          setUploadModalOpen(false);
        }}
      />
    </Card>
  );
}

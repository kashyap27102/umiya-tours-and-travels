"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight, ImagePlus, X } from "lucide-react";
import { Badge, Button, Card, CardTitle, Textarea } from "@/components/ui";
import { MediaThumb } from "@/components/admin/gallery/MediaThumb";
import { ImagePickerDialog } from "@/components/admin/gallery/ImagePickerDialog";
import { MAX_PACKAGE_IMAGES } from "@/lib/packages-constants";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";
import type { MediaRef } from "@/schemas/package";

interface Props {
  hook: UsePackageFormReturn;
}

export function Step2MediaSummary({ hook }: Readonly<Props>) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = hook.step2Form;

  const images = watch("images");
  const imagesError =
    typeof errors.images?.message === "string" ? errors.images.message : null;

  const setImages = (next: MediaRef[]) =>
    setValue("images", next, { shouldValidate: true, shouldDirty: true });

  const move = (index: number, by: -1 | 1) => {
    const target = index + by;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
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
              onClick={() => setPickerOpen(true)}
            >
              <ImagePlus className="h-4 w-4" />
              <span>Add images</span>
            </Button>
          )}
        </div>

        {images.length > 0 ? (
          <>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {images.map((image, index) => (
                <li
                  key={image.id}
                  className="overflow-hidden rounded-xl border border-brand-blue-900/10 bg-white"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <MediaThumb src={image.url} alt={image.alt || image.title} />
                    {index === 0 && (
                      <Badge
                        variant="accent"
                        size="sm"
                        className="absolute left-1.5 top-1.5"
                      >
                        Cover
                      </Badge>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                      title="Remove from this package"
                      className="absolute right-1.5 top-1.5 cursor-pointer rounded-full bg-white/90 p-1 text-red-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-1 px-1.5 py-1">
                    <p
                      className="min-w-0 flex-1 truncate text-xs text-brand-ink-900"
                      title={image.title}
                    >
                      {image.title}
                    </p>
                    <div className="flex shrink-0">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        title="Move earlier"
                        className="cursor-pointer rounded p-1 text-brand-muted-600 hover:bg-brand-mist-200 disabled:cursor-default disabled:opacity-30"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === images.length - 1}
                        title="Move later"
                        className="cursor-pointer rounded p-1 text-brand-muted-600 hover:bg-brand-mist-200 disabled:cursor-default disabled:opacity-30"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs text-brand-muted-600">
              The first image is the cover shown on package cards. Use the
              arrows to change the order.
            </p>
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-brand-blue-900/20 py-8 text-center text-sm text-brand-muted-600">
            No images yet. Choose from the gallery, upload, or add one by link.
          </p>
        )}

        {imagesError && <p className="text-sm text-red-600">{imagesError}</p>}
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

      <ImagePickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        mode="multiple"
        title="Add package images"
        max={MAX_PACKAGE_IMAGES - images.length}
        excludeIds={images.map((i) => i.id)}
        onSelect={(items) =>
          setImages([
            ...images,
            ...items.map(({ id, url, title, alt }) => ({ id, url, title, alt })),
          ])
        }
      />
    </Card>
  );
}

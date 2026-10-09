"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { ImagePlus, Trash2, X } from "lucide-react";
import { Badge, Button, Card, CardTitle, Input, Label } from "@/components/ui";
import { PointsEditor } from "./PointsEditor";
import ImageUploadModal from "./ImageUploadModal";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";

interface Props {
  hook: UsePackageFormReturn;
}

export function Step4Itinerary({ hook }: Readonly<Props>) {
  const { step4Form, itineraryArray, appendDay, removeDay } = hook;
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = step4Form;

  // Which day the upload dialog is currently adding a photo to.
  const [uploadDay, setUploadDay] = useState<number | null>(null);
  const itinerary = watch("itinerary");

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg" className="space-y-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Day-wise Itinerary</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={appendDay}>
            + Add Day
          </Button>
        </div>

        <div className="space-y-4">
          {itineraryArray.fields.map((dayField, index) => {
            const dayErrors = errors.itinerary?.[index];
            const pointErrors = Array.isArray(dayErrors?.points)
              ? dayErrors.points.map((e) => e?.message)
              : [];
            const imageUrl = itinerary?.[index]?.imageUrl ?? null;

            return (
              <div
                key={dayField.id}
                className="grid gap-4 rounded-xl border border-brand-blue-900/10 bg-brand-mist-200/40 p-4 sm:grid-cols-[80px_1fr]"
              >
                <div className="flex items-start gap-2 sm:flex-col sm:items-center sm:pt-6">
                  <Badge variant="brand" size="md">
                    Day {index + 1}
                  </Badge>
                  {itineraryArray.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(index)}
                      className="shrink-0 cursor-pointer rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                      title="Delete day"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <Controller
                    name={`itinerary.${index}.title`}
                    control={control}
                    render={({ field: f }) => (
                      <Input
                        label="Title"
                        placeholder="e.g. Arrival in Goa"
                        variant={dayErrors?.title ? "error" : "default"}
                        errorMessage={dayErrors?.title?.message}
                        {...f}
                      />
                    )}
                  />

                  <Controller
                    name={`itinerary.${index}.points`}
                    control={control}
                    render={({ field: f }) => (
                      <PointsEditor
                        label="What happens this day"
                        value={f.value}
                        onChange={f.onChange}
                        itemErrors={pointErrors}
                        listError={
                          typeof dayErrors?.points?.message === "string"
                            ? dayErrors.points.message
                            : undefined
                        }
                      />
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Photo (optional)</Label>
                    {imageUrl ? (
                      <div className="relative inline-block">
                        <img
                          src={imageUrl}
                          alt={`Day ${index + 1} preview`}
                          className="h-28 w-44 rounded-xl border border-brand-blue-900/10 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setValue(`itinerary.${index}.imageUrl`, null, {
                              shouldDirty: true,
                            })
                          }
                          title="Remove photo"
                          className="absolute right-1 top-1 cursor-pointer rounded-full bg-white/90 p-1 text-red-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setUploadDay(index)}
                        >
                          <ImagePlus className="h-4 w-4" />
                          <span>Add photo</span>
                        </Button>
                      </div>
                    )}
                    {dayErrors?.imageUrl && (
                      <p role="alert" className="text-xs text-red-500">
                        {dayErrors.imageUrl.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <ImageUploadModal
        open={uploadDay !== null}
        onClose={() => setUploadDay(null)}
        onUploadComplete={(url) => {
          if (uploadDay !== null) {
            setValue(`itinerary.${uploadDay}.imageUrl`, url, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
          setUploadDay(null);
        }}
      />
    </div>
  );
}

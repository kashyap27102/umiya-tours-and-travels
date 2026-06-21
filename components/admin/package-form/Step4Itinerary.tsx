"use client";

import { Controller } from "react-hook-form";
import {
  Badge,
  Button,
  Card,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";

interface Props {
  hook: UsePackageFormReturn;
}

export function Step4Itinerary({ hook }: Readonly<Props>) {
  const { step4Form, itineraryArray, appendDay, removeDay } = hook;
  const {
    control,
    formState: { errors },
  } = step4Form;

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
          {itineraryArray.fields.map((dayField, index) => (
            <div
              key={dayField.id}
              className="grid gap-4 rounded-xl border border-brand-blue-900/10 bg-brand-mist-200/40 p-4 sm:grid-cols-[80px_1fr_1fr]"
            >
              <div className="flex items-start gap-2 sm:flex-col sm:items-center sm:pt-6">
                <Badge variant="brand" size="md">
                  Day {index + 1}
                </Badge>
                {itineraryArray.fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDay(index)}
                    className="cursor-pointer text-xs font-medium text-red-500 transition-colors hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <Controller
                name={`itinerary.${index}.title`}
                control={control}
                render={({ field: f }) => (
                  <Input
                    label="Title"
                    placeholder="e.g. Arrival in Goa"
                    variant={
                      errors.itinerary?.[index]?.title ? "error" : "default"
                    }
                    errorMessage={errors.itinerary?.[index]?.title?.message}
                    {...f}
                  />
                )}
              />

              <Controller
                name={`itinerary.${index}.description`}
                control={control}
                render={({ field: f }) => (
                  <Textarea
                    label="Description"
                    rows={2}
                    placeholder="Day activities and details..."
                    variant={
                      errors.itinerary?.[index]?.description
                        ? "error"
                        : "default"
                    }
                    errorMessage={
                      errors.itinerary?.[index]?.description?.message
                    }
                    {...f}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

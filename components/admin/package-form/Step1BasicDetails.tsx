"use client";

import { Controller } from "react-hook-form";
import {
  Card,
  CardTitle,
  Input,
  Label,
  MultiSelect,
  Select,
} from "@/components/ui";
import { PACKAGE_STATUS_OPTIONS } from "@/lib/packages-constants";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";
import type { DestinationWithHotels } from "@/services/taxonomy-service";
import type { Category } from "@/app/generated/prisma/client";

const STATUS_OPTIONS = PACKAGE_STATUS_OPTIONS.map((s) => ({
  label: s.charAt(0).toUpperCase() + s.slice(1),
  value: s,
}));

interface Props {
  hook: UsePackageFormReturn;
  destinations: DestinationWithHotels[];
  categories: Category[];
}

export function Step1BasicDetails({
  hook,
  destinations,
  categories,
}: Readonly<Props>) {
  const destinationOptions = destinations.map((d) => ({
    label: `${d.name} (${d.country})`,
    value: d.id,
  }));
  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const {
    control,
    formState: { errors },
  } = hook.step1Form;

  return (
    <Card variant="elevated" padding="lg" className="space-y-5">
      <CardTitle className="text-lg">Basic Details</CardTitle>

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            label="Package Name *"
            placeholder="e.g. Goa Beach Escape"
            variant={errors.name ? "error" : "default"}
            errorMessage={errors.name?.message}
            {...field}
          />
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="destinations-select" required>
            Destinations
          </Label>
          <Controller
            name="destinationIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                id="destinations-select"
                options={destinationOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select destinations"
                searchPlaceholder="Search destinations…"
                error={!!errors.destinationIds}
                errorMessage={errors.destinationIds?.message}
              />
            )}
          />
          <p className="text-xs text-brand-muted-600">
            The first one you pick is the primary destination.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categories-select" required>
            Categories
          </Label>
          <Controller
            name="categoryIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                id="categories-select"
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select categories"
                searchPlaceholder="Search categories…"
                error={!!errors.categoryIds}
                errorMessage={errors.categoryIds?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status-select">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                id="status-select"
                options={STATUS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="durationDays"
          control={control}
          render={({ field }) => (
            <Input
              label="Days *"
              type="number"
              min={1}
              placeholder="e.g. 5"
              variant={errors.durationDays ? "error" : "default"}
              errorMessage={errors.durationDays?.message}
              value={!isNaN(field.value) ? field.value : ""}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />
        <Controller
          name="durationNights"
          control={control}
          render={({ field }) => (
            <Input
              label="Nights *"
              type="number"
              min={0}
              placeholder="e.g. 4"
              variant={errors.durationNights ? "error" : "default"}
              errorMessage={errors.durationNights?.message}
              value={!isNaN(field.value) ? field.value : ""}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />
      </div>
    </Card>
  );
}

"use client";

import { Controller } from "react-hook-form";
import { Card, CardTitle, Input, Label, Select } from "@/components/ui";
import {
  PACKAGE_CATEGORIES,
  PACKAGE_STATUS_OPTIONS,
} from "@/lib/packages-constants";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";

const CATEGORY_OPTIONS = PACKAGE_CATEGORIES.map((c) => ({
  label: c,
  value: c,
}));
const STATUS_OPTIONS = PACKAGE_STATUS_OPTIONS.map((s) => ({
  label: s.charAt(0).toUpperCase() + s.slice(1),
  value: s,
}));

interface Props {
  hook: UsePackageFormReturn;
}

export function Step1BasicDetails({ hook }: Readonly<Props>) {
  const {
    control,
    formState: { errors },
  } = hook.form;

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Controller
          name="destination"
          control={control}
          render={({ field }) => (
            <Input
              label="Destination *"
              placeholder="e.g. Goa"
              variant={errors.destination ? "error" : "default"}
              errorMessage={errors.destination?.message}
              {...field}
            />
          )}
        />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category-select" required>
            Category
          </Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                id="category-select"
                options={CATEGORY_OPTIONS}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Select category"
                error={!!errors.category}
                errorMessage={errors.category?.message}
              />
            )}
          />
        </div>

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

      <div className="grid gap-4 sm:grid-cols-3">
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
        <Controller
          name="pricePerPerson"
          control={control}
          render={({ field }) => (
            <Input
              label="Price Per Person (₹) *"
              type="number"
              min={1}
              placeholder="e.g. 12999"
              variant={errors.pricePerPerson ? "error" : "default"}
              errorMessage={errors.pricePerPerson?.message}
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

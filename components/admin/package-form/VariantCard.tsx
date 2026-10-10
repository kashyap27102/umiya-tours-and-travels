"use client";

import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Badge, Button, Input, Label, Select } from "@/components/ui";
import type { SelectOption } from "@/components/ui";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";
import type { DestinationWithHotels } from "@/services/taxonomy-service";

interface VariantCardProps {
  hook: UsePackageFormReturn;
  index: number;
  destinations: DestinationWithHotels[];
  canRemove: boolean;
  onRemove: () => void;
}

const toNumber = (e: React.ChangeEvent<HTMLInputElement>) =>
  e.target.value === "" ? NaN : e.target.valueAsNumber;

const numberValue = (value: number | null | undefined) =>
  value === null || value === undefined || Number.isNaN(value) ? "" : value;

export function VariantCard({
  hook,
  index,
  destinations,
  canRemove,
  onRemove,
}: Readonly<VariantCardProps>) {
  const { variantsForm, step1Form } = hook;
  const {
    control,
    setValue,
    formState: { errors },
  } = variantsForm;
  const variantErrors = errors.variants?.[index];

  const pricingMode = useWatch({ control, name: `variants.${index}.pricingMode` });
  const stays = useWatch({ control, name: `variants.${index}.stays` });
  const packageNights = useWatch({
    control: step1Form.control,
    name: "durationNights",
  });

  const prices = useFieldArray({ control, name: `variants.${index}.prices` });
  const stayRows = useFieldArray({ control, name: `variants.${index}.stays` });

  const stayNights = (stays ?? []).reduce(
    (sum, s) => sum + (Number(s.nights) || 0),
    0,
  );
  const nightsMatch = stayRows.fields.length === 0 || stayNights === packageNights;

  // Stays are limited to the destinations picked in step 1 (all destinations if
  // none picked yet). A destination already used by a stay is always kept so an
  // existing selection never loses its label.
  const packageDestinationIds = useWatch({
    control: step1Form.control,
    name: "destinationIds",
  });
  const usedDestinationIds = new Set((stays ?? []).map((s) => s.destinationId));
  const destinationOptions: SelectOption[] = destinations
    .filter(
      (d) =>
        (packageDestinationIds ?? []).length === 0 ||
        packageDestinationIds.includes(d.id) ||
        usedDestinationIds.has(d.id),
    )
    .map((d) => ({ label: `${d.name} (${d.country})`, value: d.id }));

  function hotelOptions(destinationId: string, selectedHotelId: string) {
    const destination = destinations.find((d) => d.id === destinationId);
    if (!destination) return [];
    return destination.hotels
      .filter((h) => h.isActive || h.id === selectedHotelId)
      .map((h) => ({
        label: `${h.name}${h.starRating ? ` · ${h.starRating}★` : ""}${h.isActive ? "" : " (inactive)"}`,
        value: h.id,
      }));
  }

  function setMode(mode: "flat" | "group_size") {
    setValue(`variants.${index}.pricingMode`, mode, { shouldDirty: true });
    if (mode === "group_size" && prices.fields.length === 0) {
      prices.append({ persons: 2, pricePerPerson: NaN });
    }
  }

  return (
    <div className="space-y-5 rounded-xl border border-brand-blue-900/10 bg-brand-mist-200/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="max-w-xs flex-1">
          <Controller
            name={`variants.${index}.name`}
            control={control}
            render={({ field }) => (
              <Input
                label="Variant name *"
                placeholder="e.g. Deluxe"
                variant={variantErrors?.name ? "error" : "default"}
                errorMessage={variantErrors?.name?.message}
                {...field}
              />
            )}
          />
        </div>
        {canRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            title="Remove variant"
            onClick={onRemove}
            className="border-red-300 text-red-700 hover:border-red-500 hover:bg-red-100 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        )}
      </div>

      {/* ── Pricing ── */}
      <div className="space-y-3">
        <Label>Pricing</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={pricingMode === "flat" ? "solid" : "outline"}
            onClick={() => setMode("flat")}
          >
            One price per person
          </Button>
          <Button
            type="button"
            size="sm"
            variant={pricingMode === "group_size" ? "solid" : "outline"}
            onClick={() => setMode("group_size")}
          >
            Price by group size
          </Button>
        </div>

        {pricingMode === "flat" ? (
          <div className="max-w-xs">
            <Controller
              name={`variants.${index}.flatPrice`}
              control={control}
              render={({ field }) => (
                <Input
                  label="Price per person (₹) *"
                  type="number"
                  min={1}
                  placeholder="e.g. 14999"
                  variant={variantErrors?.flatPrice ? "error" : "default"}
                  errorMessage={variantErrors?.flatPrice?.message}
                  value={numberValue(field.value)}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : e.target.valueAsNumber,
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {prices.fields.map((row, tierIndex) => {
              const tierErrors = variantErrors?.prices?.[tierIndex];
              return (
                <div
                  key={row.id}
                  className="grid items-start gap-3 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <Controller
                    name={`variants.${index}.prices.${tierIndex}.persons`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Group of (persons)"
                        type="number"
                        min={1}
                        variant={tierErrors?.persons ? "error" : "default"}
                        errorMessage={tierErrors?.persons?.message}
                        value={numberValue(field.value)}
                        onChange={(e) => field.onChange(toNumber(e))}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                  <Controller
                    name={`variants.${index}.prices.${tierIndex}.pricePerPerson`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Price per person (₹)"
                        type="number"
                        min={1}
                        variant={tierErrors?.pricePerPerson ? "error" : "default"}
                        errorMessage={tierErrors?.pricePerPerson?.message}
                        value={numberValue(field.value)}
                        onChange={(e) => field.onChange(toNumber(e))}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                  <button
                    type="button"
                    title="Remove group size"
                    onClick={() => prices.remove(tierIndex)}
                    className="mt-6 cursor-pointer rounded p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
            {typeof variantErrors?.prices?.message === "string" && (
              <p role="alert" className="text-xs text-red-500">
                {variantErrors.prices.message}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => prices.append({ persons: NaN, pricePerPerson: NaN })}
            >
              <Plus className="h-4 w-4" /> Add group size
            </Button>
          </div>
        )}
      </div>

      {/* ── Stays ── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Label>Stays</Label>
            {stayRows.fields.length > 0 && (
              <Badge variant={nightsMatch ? "success" : "outline"} size="sm">
                {stayNights} of {Number.isNaN(packageNights) ? "?" : packageNights}{" "}
                nights
              </Badge>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              stayRows.append({
                destinationId: "",
                hotelId: "",
                nights: 1,
                roomType: "",
              })
            }
          >
            <Plus className="h-4 w-4" /> Add stay
          </Button>
        </div>

        {stayRows.fields.length === 0 && (
          <p className="text-xs text-brand-muted-600">
            Optional. Add the hotels for each stop, for example 2 nights in
            Shimla and 3 in Manali.
          </p>
        )}

        {stayRows.fields.map((row, stayIndex) => {
          const stayErrors = variantErrors?.stays?.[stayIndex];
          const destinationId = stays?.[stayIndex]?.destinationId ?? "";
          const hotelId = stays?.[stayIndex]?.hotelId ?? "";
          const options = hotelOptions(destinationId, hotelId);
          const destinationHasNoHotels =
            destinationId !== "" && options.length === 0;

          return (
            <div
              key={row.id}
              className="grid items-start gap-3 rounded-lg border border-brand-blue-900/10 bg-white p-3 lg:grid-cols-[1.2fr_1.2fr_90px_1fr_auto]"
            >
              <div className="flex flex-col gap-1.5">
                <Label>Destination</Label>
                <Controller
                  name={`variants.${index}.stays.${stayIndex}.destinationId`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={destinationOptions}
                      value={field.value}
                      placeholder="Select destination"
                      error={!!stayErrors?.destinationId}
                      errorMessage={stayErrors?.destinationId?.message}
                      onChange={(value) => {
                        field.onChange(value);
                        setValue(
                          `variants.${index}.stays.${stayIndex}.hotelId`,
                          "",
                          { shouldDirty: true },
                        );
                      }}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Hotel</Label>
                <Controller
                  name={`variants.${index}.stays.${stayIndex}.hotelId`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={options}
                      value={field.value}
                      placeholder={
                        destinationId === ""
                          ? "Pick a destination first"
                          : destinationHasNoHotels
                            ? "No hotels yet"
                            : "Select hotel"
                      }
                      disabled={destinationId === "" || destinationHasNoHotels}
                      error={!!stayErrors?.hotelId}
                      errorMessage={stayErrors?.hotelId?.message}
                      onChange={field.onChange}
                    />
                  )}
                />
                {destinationHasNoHotels && (
                  <p className="text-xs text-brand-muted-600">
                    Add hotels for this destination on the Destinations page.
                  </p>
                )}
              </div>

              <Controller
                name={`variants.${index}.stays.${stayIndex}.nights`}
                control={control}
                render={({ field }) => (
                  <Input
                    label="Nights"
                    type="number"
                    min={1}
                    variant={stayErrors?.nights ? "error" : "default"}
                    errorMessage={stayErrors?.nights?.message}
                    value={numberValue(field.value)}
                    onChange={(e) => field.onChange(toNumber(e))}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                )}
              />

              <Controller
                name={`variants.${index}.stays.${stayIndex}.roomType`}
                control={control}
                render={({ field }) => (
                  <Input
                    label="Room type"
                    placeholder="e.g. Deluxe Room"
                    variant={stayErrors?.roomType ? "error" : "default"}
                    errorMessage={stayErrors?.roomType?.message}
                    {...field}
                  />
                )}
              />

              <button
                type="button"
                title="Remove stay"
                onClick={() => stayRows.remove(stayIndex)}
                className="mt-6 cursor-pointer rounded p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}

        {typeof variantErrors?.stays?.message === "string" && (
          <p role="alert" className="text-xs text-red-500">
            {variantErrors.stays.message}
          </p>
        )}
      </div>
    </div>
  );
}

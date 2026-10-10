"use client";

import { useFieldArray } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button, Card, CardTitle } from "@/components/ui";
import { VariantCard } from "./VariantCard";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";
import type { DestinationWithHotels } from "@/services/taxonomy-service";

interface Props {
  hook: UsePackageFormReturn;
  destinations: DestinationWithHotels[];
}

export function StepVariantsPricing({ hook, destinations }: Readonly<Props>) {
  const { variantsForm } = hook;
  const { control, formState } = variantsForm;
  const variants = useFieldArray({ control, name: "variants" });

  return (
    <Card variant="elevated" padding="lg" className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-lg">Variants & Pricing</CardTitle>
          <p className="mt-1 text-xs text-brand-muted-600">
            Offer the same trip in different stay levels (for example Deluxe and
            Premium), each with its own price and hotels.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            variants.append({
              name: "",
              pricingMode: "flat",
              flatPrice: null,
              prices: [],
              stays: [],
            })
          }
        >
          <Plus className="h-4 w-4" /> Add variant
        </Button>
      </div>

      {typeof formState.errors.variants?.message === "string" && (
        <p role="alert" className="text-xs text-red-500">
          {formState.errors.variants.message}
        </p>
      )}

      <div className="space-y-4">
        {variants.fields.map((field, index) => (
          <VariantCard
            key={field.id}
            hook={hook}
            index={index}
            destinations={destinations}
            canRemove={variants.fields.length > 1}
            onRemove={() => variants.remove(index)}
          />
        ))}
      </div>
    </Card>
  );
}

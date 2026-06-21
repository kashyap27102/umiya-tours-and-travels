"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { packageFormSchema, type PackageFormValues } from "@/schemas/package";

export const PACKAGE_FORM_STEPS = [
  "Basic Details",
  "Media & Summary",
  "Package Features",
  "Itinerary",
  "Review",
] as const;

export type PackageFormStep = (typeof PACKAGE_FORM_STEPS)[number];

// Fields validated when advancing past each step
const STEP_FIELDS: (keyof PackageFormValues)[][] = [
  [
    "name",
    "destination",
    "category",
    "status",
    "durationDays",
    "durationNights",
    "pricePerPerson",
  ],
  ["image", "summary"],
  ["highlights", "inclusions", "exclusions"],
  ["itinerary"],
  [], // Review step - no additional validation
];

export function usePackageForm(defaultValues?: Partial<PackageFormValues>) {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      name: "",
      destination: "",
      status: "active",
      durationDays: 1,
      durationNights: 0,
      pricePerPerson: 0,
      image: "",
      summary: "",
      highlights: [""],
      inclusions: [""],
      exclusions: [""],
      itinerary: [{ day: 1, title: "", description: "" }],
      ...defaultValues,
    },
    mode: "onTouched",
  });

  const itineraryArray = useFieldArray({
    control: form.control,
    name: "itinerary",
  });

  const goToNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const valid = await form.trigger(fields);
    if (valid)
      setCurrentStep((s) => Math.min(s + 1, PACKAGE_FORM_STEPS.length - 1));
  };

  const goToPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const goToStep = (step: number) => {
    if (step >= 0 && step < currentStep) setCurrentStep(step);
  };

  const addItem = (field: "highlights" | "inclusions" | "exclusions") => {
    form.setValue(field, [...form.getValues(field), ""], { shouldDirty: true });
  };

  const removeItem = (
    field: "highlights" | "inclusions" | "exclusions",
    i: number,
  ) => {
    const current = form.getValues(field);
    if (current.length <= 1) return;
    form.setValue(
      field,
      current.filter((_, idx) => idx !== i),
      {
        shouldDirty: true,
      },
    );
  };

  const updateItem = (
    field: "highlights" | "inclusions" | "exclusions",
    i: number,
    val: string,
  ) => {
    const current = [...form.getValues(field)];
    current[i] = val;
    form.setValue(field, current, { shouldDirty: true });
  };

  const appendDay = () => {
    itineraryArray.append({
      day: itineraryArray.fields.length + 1,
      title: "",
      description: "",
    });
  };

  const removeDay = (index: number) => {
    if (itineraryArray.fields.length <= 1) return;
    itineraryArray.remove(index);
    // Re-number remaining days on next tick after react-hook-form updates
    setTimeout(() => {
      const current = form.getValues("itinerary");
      current.forEach((_, i) => {
        form.setValue(`itinerary.${i}.day`, i + 1, { shouldDirty: true });
      });
    }, 0);
  };

  return {
    form,
    currentStep,
    steps: PACKAGE_FORM_STEPS,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === PACKAGE_FORM_STEPS.length - 1,
    goToNext,
    goToPrev,
    goToStep,
    itineraryArray,
    appendDay,
    removeDay,
    addItem,
    removeItem,
    updateItem,
  };
}

export type UsePackageFormReturn = ReturnType<typeof usePackageForm>;

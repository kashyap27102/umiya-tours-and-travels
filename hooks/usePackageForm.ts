"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  type Step1Values,
  type Step2Values,
  type Step3Values,
  type Step4Values,
  type PackageFormValues,
} from "@/schemas/package";
import { PACKAGE_FORM_STEPS, PackageMetaField } from "@/constants";

export function usePackageForm(defaultValues?: Partial<PackageFormValues>) {
  const [currentStep, setCurrentStep] = useState(0);

  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      destination: defaultValues?.destination ?? "",
      status: defaultValues?.status ?? "active",
      durationDays: defaultValues?.durationDays ?? 1,
      durationNights: defaultValues?.durationNights ?? 0,
      pricePerPerson: defaultValues?.pricePerPerson ?? 0,
      ...(defaultValues?.category ? { category: defaultValues.category } : {}),
    },
    mode: "onTouched",
  });

  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      images: defaultValues?.images ?? [],
      summary: defaultValues?.summary ?? "",
    },
    mode: "onTouched",
  });

  const step3Form = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      highlights: defaultValues?.highlights ?? [""],
      inclusions: defaultValues?.inclusions ?? [""],
      exclusions: defaultValues?.exclusions ?? [""],
    },
    mode: "onTouched",
  });

  const step4Form = useForm<Step4Values>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      itinerary: defaultValues?.itinerary ?? [
        { day: 1, title: "", description: "" },
      ],
    },
    mode: "onTouched",
  });

  const stepForms = [step1Form, step2Form, step3Form, step4Form] as const;

  const itineraryArray = useFieldArray({
    control: step4Form.control,
    name: "itinerary",
  });

  const goToNext = async () => {
    if (currentStep < 4) {
      const currentForm = stepForms[currentStep as 0 | 1 | 2 | 3];
      const valid = await currentForm.trigger();
      if (valid)
        setCurrentStep((s) => Math.min(s + 1, PACKAGE_FORM_STEPS.length - 1));
    }
  };

  const goToPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const goToStep = (step: number) => {
    if (step >= 0 && step < currentStep) setCurrentStep(step);
  };

  const addItem = (field: PackageMetaField) => {
    step3Form.setValue(field, [...step3Form.getValues(field), ""], {
      shouldDirty: true,
    });
  };

  const removeItem = (field: PackageMetaField, i: number) => {
    const current = step3Form.getValues(field);
    if (current.length <= 1) return;
    step3Form.setValue(
      field,
      current.filter((_, idx) => idx !== i),
      { shouldDirty: true },
    );
  };

  const updateItem = (field: PackageMetaField, i: number, val: string) => {
    const current = [...step3Form.getValues(field)];
    current[i] = val;
    step3Form.setValue(field, current, { shouldDirty: true });
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
    setTimeout(() => {
      const current = step4Form.getValues("itinerary");
      current.forEach((_, i) => {
        step4Form.setValue(`itinerary.${i}.day`, i + 1, { shouldDirty: true });
      });
    }, 0);
  };

  const getCombinedData = (): PackageFormValues => ({
    ...step1Form.getValues(),
    ...step2Form.getValues(),
    ...step3Form.getValues(),
    ...step4Form.getValues(),
  });

  const resetAll = () => {
    step1Form.reset();
    step2Form.reset();
    step3Form.reset();
    step4Form.reset();
    setCurrentStep(0);
  };

  return {
    step1Form,
    step2Form,
    step3Form,
    step4Form,
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
    getCombinedData,
    resetAll,
  };
}

export type UsePackageFormReturn = ReturnType<typeof usePackageForm>;

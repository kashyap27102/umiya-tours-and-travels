"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { StepIndicator } from "./package-form/StepIndicator";
import { Step1BasicDetails } from "./package-form/Step1BasicDetails";
import { Step2MediaSummary } from "./package-form/Step2MediaSummary";
import { Step3Features } from "./package-form/Step3Features";
import { Step4Itinerary } from "./package-form/Step4Itinerary";
import { Step5Review } from "./package-form/Step5Review";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";
import type { PackageFormValues } from "@/schemas/package";

interface PackageFormProps extends UsePackageFormReturn {
  submitLabel: string;
  onValidSubmit: (data: PackageFormValues) => void;
}

const STEP_PANELS = [
  Step1BasicDetails,
  Step2MediaSummary,
  Step3Features,
  Step4Itinerary,
  Step5Review,
];

export default function PackageForm({
  submitLabel,
  onValidSubmit,
  ...hook
}: Readonly<PackageFormProps>) {
  const {
    form,
    currentStep,
    steps,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrev,
    goToStep,
  } = hook;

  const StepPanel = STEP_PANELS[currentStep];

  return (
    <form onSubmit={form.handleSubmit(onValidSubmit)} className="space-y-6">
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        goToStep={goToStep}
      />

      <StepPanel hook={hook} />

      <div className="flex items-center justify-between">
        <div>
          {!isFirstStep && (
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={goToPrev}
              title="Go back"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          )}
        </div>
        <div>
          {isLastStep ? (
            <Button type="submit" variant="primary" size="lg">
              {submitLabel}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={goToNext}
              title="Go to next step"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

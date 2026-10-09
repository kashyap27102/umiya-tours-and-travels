"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { StepIndicator } from "./package-form/StepIndicator";
import { Step1BasicDetails } from "./package-form/Step1BasicDetails";
import { StepVariantsPricing } from "./package-form/StepVariantsPricing";
import { Step2MediaSummary } from "./package-form/Step2MediaSummary";
import { Step3Features } from "./package-form/Step3Features";
import { Step4Itinerary } from "./package-form/Step4Itinerary";
import { Step5Review } from "./package-form/Step5Review";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";
import type { PackageFormValues } from "@/schemas/package";
import type { DestinationWithHotels } from "@/services/taxonomy-service";
import type { Category } from "@/app/generated/prisma/client";

interface PackageFormProps extends UsePackageFormReturn {
  submitLabel: string;
  onValidSubmit: (data: PackageFormValues) => void;
  isSubmitting?: boolean;
  destinations: DestinationWithHotels[];
  categories: Category[];
}

export default function PackageForm({
  submitLabel,
  onValidSubmit,
  isSubmitting = false,
  destinations,
  categories,
  ...hook
}: Readonly<PackageFormProps>) {
  const {
    currentStep,
    steps,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrev,
    goToStep,
    getCombinedData,
  } = hook;

  // Order must match PACKAGE_FORM_STEPS.
  const stepPanels = [
    <Step1BasicDetails
      key="basic"
      hook={hook}
      destinations={destinations}
      categories={categories}
    />,
    <StepVariantsPricing key="variants" hook={hook} destinations={destinations} />,
    <Step2MediaSummary key="media" hook={hook} />,
    <Step3Features key="features" hook={hook} />,
    <Step4Itinerary key="itinerary" hook={hook} />,
  ];

  return (
    <div className="space-y-6">
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        goToStep={goToStep}
      />

      {isLastStep ? (
        <Step5Review
          data={getCombinedData()}
          destinations={destinations}
          categories={categories}
        />
      ) : (
        stepPanels[currentStep]
      )}

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
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              onClick={() => onValidSubmit(getCombinedData())}
            >
              {isSubmitting ? "Creating..." : submitLabel}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={goToNext}
              title="Go to next step"
              disabled={isSubmitting}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

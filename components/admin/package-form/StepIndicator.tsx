"use client";

import { Fragment } from "react";
import { Card } from "@/components/ui";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsConnector,
} from "@/components/ui";
import type { PackageFormStep } from "@/hooks/usePackageForm";

interface StepIndicatorProps {
  steps: readonly PackageFormStep[];
  currentStep: number;
  goToStep: (step: number) => void;
}

export function StepIndicator({
  steps,
  currentStep,
  goToStep,
}: StepIndicatorProps) {
  return (
    <Card variant="elevated" padding="sm" className="space-y-1.5">
      <Tabs value={steps[currentStep]}>
        <TabsList className="w-full px-2">
          {steps.map((step, i) => (
            <Fragment key={step}>
              <TabsTrigger
                value={step}
                stepNumber={i + 1}
                isCompleted={i < currentStep}
                disabled={i > currentStep}
                onClick={i < currentStep ? () => goToStep(i) : undefined}
              >
                {step}
              </TabsTrigger>
              {i < steps.length - 1 && (
                <TabsConnector active={i < currentStep} />
              )}
            </Fragment>
          ))}
        </TabsList>
      </Tabs>

      <p className="px-3 pb-1 text-xs font-medium text-brand-muted-600">
        <span className="font-bold text-brand-blue-600">
          Step {currentStep + 1} of {steps.length}
        </span>
        {" — "}
        {steps[currentStep]}
      </p>
    </Card>
  );
}

"use client";

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";
import { exportCustomPackagePdf } from "@/lib/pdf/custom-package-pdf";
import type {
  CustomPackageValues,
  ItineraryDay,
} from "@/hooks/useCustomPackageForm";

type CustomPackageFormProps = {
  values: CustomPackageValues;
  formError: string;
  successMessage: string;
  setField: <K extends keyof CustomPackageValues>(
    key: K,
    value: CustomPackageValues[K],
  ) => void;
  updateItineraryDay: (
    index: number,
    key: keyof ItineraryDay,
    nextValue: string,
  ) => void;
  addDay: () => void;
  removeDay: (index: number) => void;
  resetFormState: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function CustomPackageForm({
  values,
  formError,
  successMessage,
  setField,
  updateItineraryDay,
  addDay,
  removeDay,
  resetFormState,
  handleSubmit,
}: CustomPackageFormProps) {
  return (
    <Card variant="elevated" padding="lg" className="space-y-6">
      <div>
        <CardTitle className="text-2xl md:text-3xl">
          Create Custom Travel Package
        </CardTitle>
        <CardBody className="mt-2">
          Build a package with full journey details, day-wise itinerary, and
          pricing.
        </CardBody>
      </div>

      {formError && (
        <div className="rounded-xl border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-brand-green-500/30 bg-brand-green-500/10 px-4 py-3 text-sm text-brand-green-700">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Package Name"
            placeholder="e.g. Kerala Family Escape"
            value={values.packageName}
            onChange={(event) => setField("packageName", event.target.value)}
          />

          <Input
            label="Traveler Count"
            type="number"
            min={1}
            placeholder="e.g. 5"
            value={values.travelerCount}
            onChange={(event) => setField("travelerCount", event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Date of Departure"
            type="date"
            value={values.departureDate}
            onChange={(event) => setField("departureDate", event.target.value)}
          />

          <Input
            label="Date of Arrival"
            type="date"
            value={values.arrivalDate}
            onChange={(event) => setField("arrivalDate", event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Place of Departure"
            placeholder="e.g. Ahmedabad"
            value={values.departurePlace}
            onChange={(event) => setField("departurePlace", event.target.value)}
          />

          <Input
            label="Place of Arrival"
            placeholder="e.g. Kochi"
            value={values.arrivalPlace}
            onChange={(event) => setField("arrivalPlace", event.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-muted-600">
              Day-wise Itinerary
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={addDay}>
              Add Day
            </Button>
          </div>

          <div className="space-y-4">
            {values.itinerary.map((item, index) => (
              <Card
                key={`${item.dayLabel}-${index}`}
                variant="default"
                padding="md"
              >
                <div className="grid gap-4 md:grid-cols-6">
                  <Input
                    label="Day"
                    className="md:col-span-2"
                    value={item.dayLabel}
                    onChange={(event) =>
                      updateItineraryDay(index, "dayLabel", event.target.value)
                    }
                  />

                  <div className="md:col-span-4 space-y-2">
                    <Textarea
                      label="Itinerary Details"
                      placeholder="Mention activities, hotel transfer, sightseeing, meals, etc."
                      className="min-h-28"
                      value={item.details}
                      onChange={(event) =>
                        updateItineraryDay(index, "details", event.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDay(index)}
                      disabled={values.itinerary.length === 1}
                    >
                      Remove Day
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Amount Per Person"
            type="number"
            min={1}
            placeholder="e.g. 14500"
            value={values.amountPerPerson}
            onChange={(event) =>
              setField("amountPerPerson", event.target.value)
            }
          />

          <Input
            label="Vehicle for Traveling"
            placeholder="e.g. Tempo Traveller / Sedan"
            value={values.vehicle}
            onChange={(event) => setField("vehicle", event.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="solid"
            size="lg"
            onClick={async () => {
              await exportCustomPackagePdf({
                ...values,
                createdAt: new Date().toLocaleString(),
              });
            }}
          >
            Export PDF
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={resetFormState}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}

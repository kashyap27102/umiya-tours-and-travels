"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Input,
} from "@/components/ui";
import VehicleSelector from "@/components/forms/VehicleSelector";
import { appConfig } from "@/lib/config";
import {
  GROUP_VEHICLE_TYPES,
  TRAVEL_PURPOSES,
  type GROUP_VEHICLE_TYPES as GroupVehicleType,
  type TRAVEL_PURPOSES as TravelPurpose,
} from "@/lib/form-constants";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import {
  vehicleBookingSchema,
  type VehicleBookingInput,
} from "@/schemas/vehicle-booking";

const vehicleDescriptions: Partial<
  Record<(typeof GROUP_VEHICLE_TYPES)[number], string>
> = {
  "Tempo Traveller 9-14": "Ideal for family tours and smaller groups",
  "Mini Bus 20-27": "Comfortable option for medium-size group travel",
  "Full Bus 35-50+": "Best for school, corporate, and large pilgrimages",
};

type VehicleBookingFormValues = {
  vehicleType: GroupVehicleType[number];
  departureLocation: string;
  destinationRoute: string;
  travelStartDate: string;
  travelEndDate: string;
  passengers: number;
  purpose: TravelPurpose[number];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

const initialValues: VehicleBookingFormValues = {
  vehicleType: "Tempo Traveller 9-14",
  departureLocation: "",
  destinationRoute: "",
  travelStartDate: "",
  travelEndDate: "",
  passengers: 1,
  purpose: "Tour",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
};

export default function VehicleBookingForm() {
  const [values, setValues] = useState(initialValues);

  const {
    submit,
    isSubmitting,
    isSuccess,
    isError,
    errorMessage,
    fieldErrors,
    reset,
  } = useFormSubmit({
    schema: vehicleBookingSchema,
    endpoint: appConfig.forms.formspree.vehicleBookingEndpoint,
    toPayload: (data) => ({
      ...data,
      service: "Vehicle Booking",
    }),
  });

  const setField = <K extends keyof VehicleBookingFormValues>(
    key: K,
    next: VehicleBookingFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: next }));
  };

  const commonError = useMemo(
    () => fieldErrors as Record<string, string | undefined>,
    [fieldErrors],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: VehicleBookingInput = {
      ...values,
      travelStartDate: values.travelStartDate as unknown as Date,
      travelEndDate: values.travelEndDate
        ? (values.travelEndDate as unknown as Date)
        : undefined,
    };

    const result = await submit(payload);

    if (result.ok) {
      setValues(initialValues);
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl md:text-3xl">
            Vehicle Booking Form
          </CardTitle>
          <CardBody className="mt-2">
            Book group transport for tours, events, pilgrimages, schools, and
            corporate travel.
          </CardBody>
        </div>
        <Badge variant="brand" size="md">
          Group Transport
        </Badge>
      </div>

      {isSuccess && (
        <div className="rounded-xl border border-brand-green-500/30 bg-brand-green-500/10 px-4 py-3 text-sm text-brand-green-700">
          Your vehicle booking request was submitted successfully. Our team will
          contact you soon.
        </div>
      )}

      {isError && errorMessage && (
        <div className="rounded-xl border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <VehicleSelector
          options={GROUP_VEHICLE_TYPES}
          value={values.vehicleType}
          onChange={(next) =>
            setField(
              "vehicleType",
              next as VehicleBookingFormValues["vehicleType"],
            )
          }
          descriptions={vehicleDescriptions}
          label="Group Vehicle Type"
          errorMessage={commonError.vehicleType}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Departure Location"
            placeholder="Enter departure location"
            value={values.departureLocation}
            onChange={(e) => setField("departureLocation", e.target.value)}
            errorMessage={commonError.departureLocation}
          />

          <Input
            label="Destination / Route"
            placeholder="Enter destination or route"
            value={values.destinationRoute}
            onChange={(e) => setField("destinationRoute", e.target.value)}
            errorMessage={commonError.destinationRoute}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Travel Start Date"
            type="date"
            value={values.travelStartDate}
            onChange={(e) => setField("travelStartDate", e.target.value)}
            errorMessage={commonError.travelStartDate}
          />

          <Input
            label="Travel End Date (Optional)"
            type="date"
            value={values.travelEndDate}
            onChange={(e) => setField("travelEndDate", e.target.value)}
            errorMessage={commonError.travelEndDate}
          />

          <Input
            label="Passengers"
            type="number"
            min={1}
            max={80}
            value={values.passengers}
            onChange={(e) => setField("passengers", Number(e.target.value))}
            errorMessage={commonError.passengers}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="travel-purpose"
              className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600"
            >
              Purpose
            </label>
            <select
              id="travel-purpose"
              className="min-h-11 w-full rounded-xl border border-brand-blue-900/20 bg-white px-4 py-2.5 text-sm font-medium text-brand-ink-900 transition-all outline-none focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-500/20"
              value={values.purpose}
              onChange={(e) =>
                setField(
                  "purpose",
                  e.target.value as VehicleBookingFormValues["purpose"],
                )
              }
            >
              {TRAVEL_PURPOSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {commonError.purpose && (
              <p className="text-xs text-red-500">{commonError.purpose}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Contact Name"
            placeholder="Enter full name"
            value={values.contactName}
            onChange={(e) => setField("contactName", e.target.value)}
            errorMessage={commonError.contactName}
          />

          <Input
            label="Contact Phone"
            type="tel"
            placeholder="Enter phone number"
            value={values.contactPhone}
            onChange={(e) => setField("contactPhone", e.target.value)}
            errorMessage={commonError.contactPhone}
          />

          <Input
            label="Contact Email"
            type="email"
            placeholder="Enter email address"
            value={values.contactEmail}
            onChange={(e) => setField("contactEmail", e.target.value)}
            errorMessage={commonError.contactEmail}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Vehicle Request"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setValues(initialValues);
              reset();
            }}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}

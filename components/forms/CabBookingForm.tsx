"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";
import TripTypeSelector from "@/components/forms/TripTypeSelector";
import VehicleSelector from "@/components/forms/VehicleSelector";
import { appConfig } from "@/lib/config";
import { CAB_VEHICLE_TYPES, TRIP_TYPES } from "@/lib/form-constants";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { cabBookingSchema, type CabBookingInput } from "@/schemas/cab-booking";

const vehicleDescriptions: Partial<
  Record<(typeof CAB_VEHICLE_TYPES)[number], string>
> = {
  Sedan: "Comfortable for 1-3 travelers",
  SUV: "Extra space for families",
  "Innova Crysta": "Premium long-distance comfort",
  Luxury: "Best-in-class experience",
};

type CabBookingFormValues = {
  tripType: (typeof TRIP_TYPES)[number];
  pickupLocation: string;
  dropLocation: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  vehicleType: (typeof CAB_VEHICLE_TYPES)[number];
  specialRequests: string;
};

const initialValues: CabBookingFormValues = {
  tripType: "One Way",
  pickupLocation: "",
  dropLocation: "",
  departureDate: "",
  returnDate: "",
  passengers: 1,
  vehicleType: "Sedan",
  specialRequests: "",
};

export default function CabBookingForm() {
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
    schema: cabBookingSchema,
    endpoint: appConfig.forms.formspree.cabBookingEndpoint,
    toPayload: (data) => ({
      ...data,
      service: "Cab Booking",
    }),
  });

  const isRoundTrip = values.tripType === "Round Trip";

  const setField = <K extends keyof CabBookingFormValues>(
    key: K,
    next: CabBookingFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: next }));
  };

  const commonError = useMemo(
    () => fieldErrors as Record<string, string | undefined>,
    [fieldErrors],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CabBookingInput = {
      ...values,
      departureDate: values.departureDate as unknown as Date,
      returnDate: isRoundTrip
        ? ((values.returnDate || undefined) as unknown as Date | undefined)
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
            Cab Booking Form
          </CardTitle>
          <CardBody className="mt-2">
            Fill in your route and trip details. We will confirm pricing and
            driver details quickly.
          </CardBody>
        </div>
        <Badge variant="brand" size="md">
          24x7 Support
        </Badge>
      </div>

      {isSuccess && (
        <div className="rounded-xl border border-brand-green-500/30 bg-brand-green-500/10 px-4 py-3 text-sm text-brand-green-700">
          Your cab request was submitted successfully. Our team will contact you
          soon.
        </div>
      )}

      {isError && errorMessage && (
        <div className="rounded-xl border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <TripTypeSelector
          options={TRIP_TYPES}
          value={values.tripType}
          onChange={(next) => {
            reset();
            setField("tripType", next);
          }}
          errorMessage={commonError.tripType}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Pickup Location"
            placeholder="Enter pickup location"
            value={values.pickupLocation}
            onChange={(e) => setField("pickupLocation", e.target.value)}
            errorMessage={commonError.pickupLocation}
          />

          <Input
            label="Drop Location"
            placeholder="Enter destination"
            value={values.dropLocation}
            onChange={(e) => setField("dropLocation", e.target.value)}
            errorMessage={commonError.dropLocation}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Departure Date & Time"
            type="datetime-local"
            value={values.departureDate}
            onChange={(e) => setField("departureDate", e.target.value)}
            errorMessage={commonError.departureDate}
          />

          {isRoundTrip ? (
            <Input
              label="Return Date & Time"
              type="datetime-local"
              value={values.returnDate}
              onChange={(e) => setField("returnDate", e.target.value)}
              errorMessage={commonError.returnDate}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-brand-blue-900/20 bg-brand-mist-200/35 px-4 py-3 text-sm text-brand-muted-600">
              Return date is required only for round trips.
            </div>
          )}
        </div>

        <Input
          label="Passengers"
          type="number"
          min={1}
          max={80}
          value={values.passengers}
          onChange={(e) => setField("passengers", Number(e.target.value))}
          errorMessage={commonError.passengers}
        />

        <VehicleSelector
          options={CAB_VEHICLE_TYPES}
          value={values.vehicleType}
          onChange={(next) =>
            setField("vehicleType", next as CabBookingFormValues["vehicleType"])
          }
          descriptions={vehicleDescriptions}
          errorMessage={commonError.vehicleType}
        />

        <Textarea
          label="Special Requests (Optional)"
          placeholder="Luggage info, child seat requirement, pickup notes, etc."
          value={values.specialRequests}
          onChange={(e) => setField("specialRequests", e.target.value)}
          errorMessage={commonError.specialRequests}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Booking Request"}
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

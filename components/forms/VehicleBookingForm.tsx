"use client";

import { useTransition, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Input,
  Select,
  Textarea,
} from "@/components/ui";
import TripTypeSelector from "@/components/forms/TripTypeSelector";
import VehicleSelector from "@/components/forms/VehicleSelector";
import { submitVehicleBookingForm } from "@/lib/actions/vehicle-booking-actions";
import { TRAVEL_PURPOSES, TRIP_TYPES, VEHICLE_TYPES } from "@/lib/form-constants";
import {
  vehicleBookingSchema,
  type VehicleBookingData,
  type VehicleBookingInput,
} from "@/schemas/vehicle-booking";

const vehicleDescriptions: Partial<Record<(typeof VEHICLE_TYPES)[number], string>> = {
  Sedan: "Comfortable for 1-3 travelers",
  SUV: "Extra space for families",
  "Innova Crysta": "Premium long-distance comfort",
  Luxury: "Best-in-class experience",
  "Tempo Traveller 9-14": "Ideal for family tours and smaller groups",
  "Mini Bus 20-27": "Comfortable option for medium-size group travel",
  "Full Bus 35-50+": "Best for school, corporate, and large pilgrimages",
};

const purposeOptions = [
  { label: "Not specified", value: "" },
  ...TRAVEL_PURPOSES.map((option) => ({ label: option, value: option })),
];

const defaultValues: VehicleBookingInput = {
  tripType: "One Way",
  vehicleType: "Sedan",
  pickupLocation: "",
  dropLocation: "",
  departureDate: "",
  returnDate: "",
  passengers: 1,
  purpose: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  specialRequests: "",
};

export default function VehicleBookingForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<VehicleBookingInput, unknown, VehicleBookingData>({
    resolver: zodResolver(vehicleBookingSchema),
    defaultValues,
  });

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isRoundTrip = watch("tripType") === "Round Trip";

  const onSubmit = (data: VehicleBookingData) => {
    startTransition(async () => {
      const result = await submitVehicleBookingForm(data);

      if (result.success) {
        setStatus("success");
        setErrorMessage(null);
        reset(defaultValues);
      } else {
        setStatus("error");
        setErrorMessage(result.error);
      }
    });
  };

  return (
    <Card variant="elevated" padding="lg" className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl md:text-3xl">
            Vehicle Booking Form
          </CardTitle>
          <CardBody className="mt-2">
            Book a cab or group vehicle for any trip — outstation rides,
            airport transfers, tours, pilgrimages, and corporate travel. We
            will confirm availability and pricing quickly.
          </CardBody>
        </div>
        <Badge variant="brand" size="md">
          24x7 Support
        </Badge>
      </div>

      {status === "success" && (
        <div className="rounded-xl border border-brand-green-500/30 bg-brand-green-500/10 px-4 py-3 text-sm text-brand-green-700">
          Your vehicle booking request was submitted successfully. Our team
          will contact you soon.
        </div>
      )}

      {status === "error" && errorMessage && (
        <div className="rounded-xl border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="tripType"
          control={control}
          render={({ field }) => (
            <TripTypeSelector
              options={TRIP_TYPES}
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.tripType?.message}
            />
          )}
        />

        <Controller
          name="vehicleType"
          control={control}
          render={({ field }) => (
            <VehicleSelector
              options={VEHICLE_TYPES}
              value={field.value}
              onChange={field.onChange}
              descriptions={vehicleDescriptions}
              errorMessage={errors.vehicleType?.message}
            />
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Pickup Location"
            placeholder="Enter pickup location"
            errorMessage={errors.pickupLocation?.message}
            {...register("pickupLocation")}
          />

          <Input
            label="Drop Location"
            placeholder="Enter destination"
            errorMessage={errors.dropLocation?.message}
            {...register("dropLocation")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Departure Date & Time"
            type="datetime-local"
            errorMessage={errors.departureDate?.message}
            {...register("departureDate")}
          />

          {isRoundTrip ? (
            <Input
              label="Return Date & Time"
              type="datetime-local"
              errorMessage={errors.returnDate?.message}
              {...register("returnDate")}
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
          errorMessage={errors.passengers?.message}
          {...register("passengers")}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="purpose"
            className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600"
          >
            Purpose (Optional)
          </label>
          <Controller
            name="purpose"
            control={control}
            render={({ field }) => (
              <Select
                id="purpose"
                value={field.value ?? ""}
                onChange={field.onChange}
                options={purposeOptions}
                errorMessage={errors.purpose?.message}
              />
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Contact Name (Optional)"
            placeholder="Enter full name"
            errorMessage={errors.contactName?.message}
            {...register("contactName")}
          />

          <Input
            label="Contact Phone (Optional)"
            type="tel"
            placeholder="Enter phone number"
            errorMessage={errors.contactPhone?.message}
            {...register("contactPhone")}
          />

          <Input
            label="Contact Email (Optional)"
            type="email"
            placeholder="Enter email address"
            errorMessage={errors.contactEmail?.message}
            {...register("contactEmail")}
          />
        </div>

        <Textarea
          label="Special Requests (Optional)"
          placeholder="Luggage info, child seat requirement, pickup notes, etc."
          errorMessage={errors.specialRequests?.message}
          {...register("specialRequests")}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Booking Request"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              reset(defaultValues);
              setStatus("idle");
              setErrorMessage(null);
            }}
            disabled={isPending}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}

import { z } from "zod";
import { TRAVEL_PURPOSES, TRIP_TYPES, VEHICLE_TYPES } from "@/lib/form-constants";
import {
  dateSchema,
  namedLocationSchema,
  optionalDateSchema,
  optionalEmailSchema,
  optionalMessageSchema,
  optionalNameSchema,
  optionalPhoneSchema,
  passengersSchema,
} from "@/schemas/shared";

export const vehicleBookingSchema = z
  .object({
    tripType: z.enum(TRIP_TYPES, {
      error: "Select a trip type",
    }),
    vehicleType: z.enum(VEHICLE_TYPES, {
      error: "Select a vehicle type",
    }),
    pickupLocation: namedLocationSchema("pickup location"),
    dropLocation: namedLocationSchema("drop location"),
    departureDate: dateSchema,
    returnDate: optionalDateSchema,
    passengers: passengersSchema,
    purpose: z.enum(TRAVEL_PURPOSES).optional().or(z.literal("")),
    contactName: optionalNameSchema,
    contactPhone: optionalPhoneSchema,
    contactEmail: optionalEmailSchema,
    specialRequests: optionalMessageSchema,
  })
  .superRefine((value, ctx) => {
    // A minute of grace: the picker only goes down to the minute.
    if (value.departureDate.getTime() < Date.now() - 60_000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["departureDate"],
        message: "Departure must be a future date and time",
      });
    }

    if (value.tripType === "Round Trip" && !value.returnDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnDate"],
        message: "Return date is required for round trips",
      });
    }

    if (value.returnDate && value.returnDate < value.departureDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnDate"],
        message: "Return date cannot be earlier than departure date",
      });
    }
  });

export type VehicleBookingInput = z.input<typeof vehicleBookingSchema>;
export type VehicleBookingData = z.infer<typeof vehicleBookingSchema>;

import { z } from "zod";
import { CAB_VEHICLE_TYPES, TRIP_TYPES } from "@/lib/form-constants";
import {
  dateSchema,
  locationSchema,
  optionalDateSchema,
  optionalMessageSchema,
  passengersSchema,
} from "@/schemas/shared";

export const cabBookingSchema = z
  .object({
    tripType: z.enum(TRIP_TYPES, {
      error: "Select a trip type",
    }),
    pickupLocation: locationSchema,
    dropLocation: locationSchema,
    departureDate: dateSchema,
    returnDate: optionalDateSchema,
    passengers: passengersSchema,
    vehicleType: z.enum(CAB_VEHICLE_TYPES, {
      error: "Select a vehicle type",
    }),
    specialRequests: optionalMessageSchema,
  })
  .superRefine((value, ctx) => {
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

export type CabBookingInput = z.input<typeof cabBookingSchema>;
export type CabBookingData = z.infer<typeof cabBookingSchema>;

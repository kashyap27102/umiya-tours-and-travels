import { z } from "zod";
import { GROUP_VEHICLE_TYPES, TRAVEL_PURPOSES } from "@/lib/form-constants";
import {
  dateSchema,
  emailSchema,
  locationSchema,
  nameSchema,
  optionalDateSchema,
  passengersSchema,
  phoneSchema,
} from "@/schemas/shared";

export const vehicleBookingSchema = z
  .object({
    vehicleType: z.enum(GROUP_VEHICLE_TYPES, {
      error: "Select a vehicle type",
    }),
    departureLocation: locationSchema,
    destinationRoute: locationSchema,
    travelStartDate: dateSchema,
    travelEndDate: optionalDateSchema,
    passengers: passengersSchema,
    purpose: z.enum(TRAVEL_PURPOSES, {
      error: "Select a purpose",
    }),
    contactName: nameSchema,
    contactPhone: phoneSchema,
    contactEmail: emailSchema,
  })
  .superRefine((value, ctx) => {
    if (value.travelEndDate && value.travelEndDate < value.travelStartDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["travelEndDate"],
        message: "End date cannot be earlier than start date",
      });
    }
  });

export type VehicleBookingInput = z.input<typeof vehicleBookingSchema>;
export type VehicleBookingData = z.infer<typeof vehicleBookingSchema>;

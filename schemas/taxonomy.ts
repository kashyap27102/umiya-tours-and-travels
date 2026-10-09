import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(80, "Max 80 characters")
  .transform((v) => (v === "" ? null : v))
  .nullable();

export const destinationSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80, "Max 80 characters"),
  state: optionalText,
  country: z
    .string()
    .trim()
    .min(2, "Country is required")
    .max(80, "Max 80 characters"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(40, "Max 40 characters"),
  sortOrder: z
    .number({ message: "Enter a number" })
    .int("Whole numbers only")
    .min(0, "Min 0")
    .max(999, "Max 999"),
});

export const hotelSchema = z.object({
  destinationId: z.string().min(1, "Destination is required"),
  name: z.string().trim().min(2, "Hotel name is required").max(120, "Max 120 characters"),
  starRating: z
    .number()
    .int("Whole numbers only")
    .min(1, "Min 1 star")
    .max(5, "Max 5 stars")
    .nullable(),
  address: z
    .string()
    .trim()
    .max(200, "Max 200 characters")
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  isActive: z.boolean(),
});

export type HotelFormInput = z.input<typeof hotelSchema>;
export type DestinationFormInput = z.input<typeof destinationSchema>;
export type CategoryFormInput = z.input<typeof categorySchema>;

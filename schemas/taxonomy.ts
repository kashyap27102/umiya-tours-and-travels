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

export type DestinationFormInput = z.input<typeof destinationSchema>;
export type CategoryFormInput = z.input<typeof categorySchema>;

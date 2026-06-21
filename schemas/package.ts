import { z } from "zod";
import {
  PACKAGE_CATEGORIES,
  PACKAGE_STATUS_OPTIONS,
} from "@/lib/packages-constants";

const itineraryItemSchema = z.object({
  day: z.number(),
  title: z.string().min(1, "Day title is required"),
  description: z.string().min(1, "Description is required"),
});

export const step1Schema = z.object({
  name: z.string().min(1, "Package name is required"),
  destination: z.string().min(1, "Destination is required"),
  category: z.enum(PACKAGE_CATEGORIES, {
    message: "Please select a valid package category",
  }),
  status: z.enum(PACKAGE_STATUS_OPTIONS),
  durationDays: z.number().min(1, "Min 1 day"),
  durationNights: z.number().min(0, "Min 0 nights"),
  pricePerPerson: z.number().min(1, "Price is required"),
});

export const step2Schema = z.object({
  image: z
    .string()
    .refine(
      (val) => val === "" || /^https?:\/\/.+/.test(val),
      "Enter a valid image URL",
    ),
  summary: z.string().min(10, "At least 10 characters"),
});

export const step3Schema = z.object({
  highlights: z.array(z.string().min(1, "Cannot be empty")).min(1),
  inclusions: z.array(z.string().min(1, "Cannot be empty")).min(1),
  exclusions: z.array(z.string().min(1, "Cannot be empty")).min(1),
});

export const step4Schema = z.object({
  itinerary: z.array(itineraryItemSchema).min(1),
});

export const packageFormSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  destination: z.string().min(1, "Destination is required"),
  category: z.enum(PACKAGE_CATEGORIES, {
    message: "Please select a valid package category",
  }),
  status: z.enum(PACKAGE_STATUS_OPTIONS),
  durationDays: z.number().min(1, "Min 1 day"),
  durationNights: z.number().min(0, "Min 0 nights"),
  pricePerPerson: z.number().min(1, "Price is required"),
  image: z
    .string()
    .refine(
      (val) => val === "" || /^https?:\/\/.+/.test(val),
      "Enter a valid image URL",
    ),
  summary: z.string().min(10, "At least 10 characters"),
  highlights: z.array(z.string().min(1, "Cannot be empty")).min(1),
  inclusions: z.array(z.string().min(1, "Cannot be empty")).min(1),
  exclusions: z.array(z.string().min(1, "Cannot be empty")).min(1),
  itinerary: z.array(itineraryItemSchema).min(1),
});

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type Step4Values = z.infer<typeof step4Schema>;
export type PackageFormValues = z.infer<typeof packageFormSchema>;

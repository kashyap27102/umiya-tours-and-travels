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

export const packageFormSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  destination: z.string().min(1, "Destination is required"),
  category: z.enum(PACKAGE_CATEGORIES),
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

export type PackageFormValues = z.infer<typeof packageFormSchema>;

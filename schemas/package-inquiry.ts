import { z } from "zod";
import { contactSchema } from "@/schemas/contact";

export const packageInquirySchema = contactSchema.extend({
  packageSlug: z.string().min(1, "Package is required"),
  travelDate: z.coerce.date({ error: "Select a valid travel date" }).optional(),
  travelers: z.coerce
    .number()
    .int("Travelers must be a whole number")
    .min(1, "At least one traveler is required")
    .max(40, "Traveler count is too high")
    .optional(),
});

export type PackageInquiryInput = z.input<typeof packageInquirySchema>;
export type PackageInquiryData = z.infer<typeof packageInquirySchema>;

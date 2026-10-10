import { z } from "zod";
import { contactSchema } from "@/schemas/contact";

export const packageInquirySchema = contactSchema
  .extend({
    packageSlug: z.string().min(1, "Select a package"),
    travelDate: z.coerce
      .date({ error: "Select a valid travel date" })
      .optional(),
    travelers: z.coerce
      .number({ error: "Enter the number of travelers" })
      .int("Travelers must be a whole number")
      .min(1, "At least one traveler is required")
      .max(
        40,
        "We can take up to 40 travelers per enquiry. Call us for larger groups.",
      )
      .optional(),
  })
  .superRefine((value, ctx) => {
    // The date picker has no time, so allow a day of slack for time zones.
    if (value.travelDate && value.travelDate.getTime() < Date.now() - 86_400_000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["travelDate"],
        message: "Travel date can't be in the past",
      });
    }
  });

export type PackageInquiryInput = z.input<typeof packageInquirySchema>;
export type PackageInquiryData = z.infer<typeof packageInquirySchema>;

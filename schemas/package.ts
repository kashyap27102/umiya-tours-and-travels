import { z } from "zod";
import {
  MAX_PACKAGE_IMAGES,
  PACKAGE_STATUS_OPTIONS,
} from "@/lib/packages-constants";

const itineraryItemSchema = z.object({
  day: z.number(),
  title: z.string().min(1, "Day title is required"),
  description: z.string().min(1, "Description is required"),
});

export const step1Schema = z.object({
  name: z.string().min(1, "Package name is required"),
  destinationIds: z.array(z.string().min(1)).min(1, "Select at least one destination"),
  categoryIds: z.array(z.string().min(1)).min(1, "Select at least one category"),
  status: z.enum(PACKAGE_STATUS_OPTIONS),
  durationDays: z.number().min(1, "Min 1 day"),
  durationNights: z.number().min(0, "Min 0 nights"),
});

const stayItemSchema = z.object({
  destinationId: z.string().min(1, "Select a destination"),
  hotelId: z.string().min(1, "Select a hotel"),
  nights: z
    .number({ message: "Enter nights" })
    .int("Whole numbers only")
    .min(1, "Min 1 night"),
  roomType: z.string().trim().max(80, "Max 80 characters"),
});

const priceTierSchema = z.object({
  persons: z
    .number({ message: "Enter persons" })
    .int("Whole numbers only")
    .min(1, "Min 1 person"),
  pricePerPerson: z
    .number({ message: "Enter a price" })
    .int("Whole numbers only")
    .min(1, "Price is required"),
});

const variantSchema = z
  .object({
    name: z.string().trim().min(1, "Variant name is required").max(40, "Max 40 characters"),
    pricingMode: z.enum(["flat", "group_size"]),
    flatPrice: z.number().int("Whole numbers only").min(1, "Price is required").nullable(),
    prices: z.array(priceTierSchema),
    stays: z.array(stayItemSchema),
  })
  .superRefine((v, ctx) => {
    if (v.pricingMode === "flat" && v.flatPrice === null) {
      ctx.addIssue({ code: "custom", path: ["flatPrice"], message: "Price is required" });
    }
    if (v.pricingMode === "group_size") {
      if (v.prices.length === 0) {
        ctx.addIssue({ code: "custom", path: ["prices"], message: "Add at least one group size" });
      }
      const seen = new Set<number>();
      v.prices.forEach((tier, i) => {
        if (seen.has(tier.persons)) {
          ctx.addIssue({ code: "custom", path: ["prices", i, "persons"], message: "Duplicate group size" });
        }
        seen.add(tier.persons);
      });
    }
  });

const variantsListSchema = z
  .array(variantSchema)
  .min(1, "Add at least one variant")
  .superRefine((variants, ctx) => {
    const seen = new Set<string>();
    variants.forEach((v, i) => {
      const key = v.name.toLowerCase();
      if (seen.has(key)) {
        ctx.addIssue({ code: "custom", path: [i, "name"], message: "Variant names must be unique" });
      }
      seen.add(key);
    });
  });

export const variantsStepSchema = z.object({ variants: variantsListSchema });

/** Stay nights must add up to the package nights (variants with no stays are allowed). */
export function findStayNightsMismatch(
  variants: { name: string; stays: { nights: number }[] }[],
  durationNights: number,
): { index: number; message: string } | null {
  for (const [index, v] of variants.entries()) {
    if (v.stays.length === 0) continue;
    const total = v.stays.reduce((sum, s) => sum + (Number(s.nights) || 0), 0);
    if (total !== durationNights) {
      return {
        index,
        message: `"${v.name || "Variant"}": stays add up to ${total} night${total === 1 ? "" : "s"}, but the package has ${durationNights}.`,
      };
    }
  }
  return null;
}

export const step2Schema = z.object({
  images: z
    .array(z.string().refine((val) => /^https?:\/\/.+/.test(val), "Invalid image URL"))
    .min(1, "At least one image is required")
    .max(MAX_PACKAGE_IMAGES, `Maximum ${MAX_PACKAGE_IMAGES} images allowed`),
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
  destinationIds: z.array(z.string().min(1)).min(1, "Select at least one destination"),
  categoryIds: z.array(z.string().min(1)).min(1, "Select at least one category"),
  status: z.enum(PACKAGE_STATUS_OPTIONS),
  durationDays: z.number().min(1, "Min 1 day"),
  durationNights: z.number().min(0, "Min 0 nights"),
  images: z
    .array(z.string().refine((val) => /^https?:\/\/.+/.test(val), "Invalid image URL"))
    .min(1, "At least one image is required")
    .max(MAX_PACKAGE_IMAGES, `Maximum ${MAX_PACKAGE_IMAGES} images allowed`),
  summary: z.string().min(10, "At least 10 characters"),
  highlights: z.array(z.string().min(1, "Cannot be empty")).min(1),
  inclusions: z.array(z.string().min(1, "Cannot be empty")).min(1),
  exclusions: z.array(z.string().min(1, "Cannot be empty")).min(1),
  itinerary: z.array(itineraryItemSchema).min(1),
  variants: variantsListSchema,
});

export type Step1Values = z.infer<typeof step1Schema>;
export type VariantsStepValues = z.infer<typeof variantsStepSchema>;
export type VariantFormValues = VariantsStepValues["variants"][number];
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type Step4Values = z.infer<typeof step4Schema>;
export type PackageFormValues = z.infer<typeof packageFormSchema>;

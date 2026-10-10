import { z } from "zod";

export const testimonialFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Name is too long"),
  location: z
    .string()
    .trim()
    .min(1, "Where the customer is from is required")
    .max(80, "Location is too long"),
  rating: z.number().int().min(1, "Rating is 1 to 5").max(5, "Rating is 1 to 5"),
  review: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review is too long (1000 characters max)"),
  imageId: z.string().min(1).nullable(),
  destinationId: z.string().min(1).nullable(),
  packageId: z.string().min(1).nullable(),
  isActive: z.boolean(),
});

export type TestimonialFormInput = z.input<typeof testimonialFormSchema>;
export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

import { z } from "zod";
import { MAX_TAG_LENGTH, MAX_TAGS, normalizeTags } from "@/lib/media";

export const mediaDetailsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give the image a title")
    .max(120, "Max 120 characters"),
  alt: z.string().trim().max(200, "Max 200 characters"),
  tags: z
    .array(z.string())
    .transform(normalizeTags)
    .refine((tags) => tags.length <= MAX_TAGS, `Max ${MAX_TAGS} tags`),
});

export const linkImportSchema = z.object({
  url: z.string().trim().min(1, "Paste a link").max(2000, "That link is too long"),
  title: z.string().trim().max(120, "Max 120 characters").optional(),
});

export type MediaDetailsInput = z.input<typeof mediaDetailsSchema>;
export type LinkImportInput = z.input<typeof linkImportSchema>;
export { MAX_TAG_LENGTH, MAX_TAGS };

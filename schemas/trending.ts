import { z } from "zod";

export const TRENDING_TITLE_MAX = 60;
export const TRENDING_SUBTITLE_MAX = 160;
export const TRENDING_MAX_PACKAGES = 12;

export const trendingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a section title")
    .max(TRENDING_TITLE_MAX, `Title can be up to ${TRENDING_TITLE_MAX} characters`),
  // Optional: leave blank for a heading with nothing under it.
  subtitle: z
    .string()
    .trim()
    .max(TRENDING_SUBTITLE_MAX, `Subtitle can be up to ${TRENDING_SUBTITLE_MAX} characters`),
  packageIds: z
    .array(z.string().min(1))
    .max(TRENDING_MAX_PACKAGES, `Choose up to ${TRENDING_MAX_PACKAGES} packages`)
    .refine((ids) => new Set(ids).size === ids.length, "A package is listed twice"),
});

export type TrendingInput = z.input<typeof trendingSchema>;
export type TrendingValues = z.infer<typeof trendingSchema>;

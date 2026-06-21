import { z } from "zod";

export const statItemSchema = z.object({
  value: z.string().min(1, "Stat value is required"),
  label: z.string().min(1, "Stat label is required"),
});

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  rating: z.number().min(1).max(5),
  review: z.string().min(10, "Review must be at least 10 characters"),
});

export const businessSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Must be a valid email"),
  whatsappNumber: z.string().min(1, "WhatsApp number is required"),
  address: z.string().min(1, "Address is required"),
});

export const heroSettingsSchema = z.object({
  heroEyebrow: z.string(),
  heroHeading: z.string().min(1, "Hero heading is required"),
  heroSubheading: z.string(),
});

export const aboutSettingsSchema = z.object({
  aboutHeading: z.string().min(1, "About heading is required"),
  aboutDescription: z.string().min(10, "About description is too short"),
  missionHeading: z.string().min(1, "Mission heading is required"),
  missionDescription: z.string().min(10, "Mission description is too short"),
});

export const statsSettingsSchema = z.object({
  stats: z.array(statItemSchema).min(1, "At least one stat is required"),
});

export const testimonialsSettingsSchema = z.object({
  testimonials: z.array(testimonialSchema),
});

export const footerSettingsSchema = z.object({
  footerTagline: z.string().min(1, "Footer tagline is required"),
});

export const siteSettingsSchema = businessSettingsSchema
  .merge(heroSettingsSchema)
  .merge(aboutSettingsSchema)
  .merge(statsSettingsSchema)
  .merge(testimonialsSettingsSchema)
  .merge(footerSettingsSchema);

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;
export type BusinessSettingsValues = z.infer<typeof businessSettingsSchema>;
export type HeroSettingsValues = z.infer<typeof heroSettingsSchema>;
export type AboutSettingsValues = z.infer<typeof aboutSettingsSchema>;
export type StatsSettingsValues = z.infer<typeof statsSettingsSchema>;
export type TestimonialsSettingsValues = z.infer<typeof testimonialsSettingsSchema>;
export type FooterSettingsValues = z.infer<typeof footerSettingsSchema>;

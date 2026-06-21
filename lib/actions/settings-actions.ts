"use server";

import { revalidatePath } from "next/cache";
import { prismaClient } from "@/lib/prisma";
import {
  businessSettingsSchema,
  heroSettingsSchema,
  aboutSettingsSchema,
  statsSettingsSchema,
  testimonialsSettingsSchema,
  footerSettingsSchema,
} from "@/schemas/settings";
import type { ApiResponse } from "@/types/api-response";

function revalidate() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

function firstError(issues: { message: string }[]): string {
  return issues[0]?.message ?? "Invalid data";
}

const SETTINGS_ID = 1;

export async function updateBusinessSettings(
  data: unknown,
): Promise<ApiResponse<null>> {
  try {
    const parsed = businessSettingsSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: firstError(parsed.error.issues) };
    await prismaClient.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: parsed.data,
      create: { id: SETTINGS_ID, ...parsed.data, heroEyebrow: "", heroHeading: "", heroSubheading: "", aboutHeading: "", aboutDescription: "", missionHeading: "", missionDescription: "", stats: [], testimonials: [], footerTagline: "" },
    });
    revalidate();
    return { success: true, data: null, message: "Business settings saved" };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to save" };
  }
}

export async function updateHeroSettings(
  data: unknown,
): Promise<ApiResponse<null>> {
  try {
    const parsed = heroSettingsSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: firstError(parsed.error.issues) };
    await prismaClient.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: parsed.data,
      create: { id: SETTINGS_ID, siteName: "", phone: "", email: "", whatsappNumber: "", address: "", ...parsed.data, aboutHeading: "", aboutDescription: "", missionHeading: "", missionDescription: "", stats: [], testimonials: [], footerTagline: "" },
    });
    revalidate();
    return { success: true, data: null, message: "Hero settings saved" };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to save" };
  }
}

export async function updateAboutSettings(
  data: unknown,
): Promise<ApiResponse<null>> {
  try {
    const parsed = aboutSettingsSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: firstError(parsed.error.issues) };
    await prismaClient.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: parsed.data,
      create: { id: SETTINGS_ID, siteName: "", phone: "", email: "", whatsappNumber: "", address: "", heroEyebrow: "", heroHeading: "", heroSubheading: "", ...parsed.data, stats: [], testimonials: [], footerTagline: "" },
    });
    revalidate();
    return { success: true, data: null, message: "About settings saved" };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to save" };
  }
}

export async function updateStatsSettings(
  data: unknown,
): Promise<ApiResponse<null>> {
  try {
    const parsed = statsSettingsSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: firstError(parsed.error.issues) };
    const stats = parsed.data.stats as unknown as object[];
    await prismaClient.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: { stats },
      create: { id: SETTINGS_ID, siteName: "", phone: "", email: "", whatsappNumber: "", address: "", heroEyebrow: "", heroHeading: "", heroSubheading: "", aboutHeading: "", aboutDescription: "", missionHeading: "", missionDescription: "", stats, testimonials: [], footerTagline: "" },
    });
    revalidate();
    return { success: true, data: null, message: "Stats saved" };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to save" };
  }
}

export async function updateTestimonialsSettings(
  data: unknown,
): Promise<ApiResponse<null>> {
  try {
    const parsed = testimonialsSettingsSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: firstError(parsed.error.issues) };
    const testimonials = parsed.data.testimonials as unknown as object[];
    await prismaClient.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: { testimonials },
      create: { id: SETTINGS_ID, siteName: "", phone: "", email: "", whatsappNumber: "", address: "", heroEyebrow: "", heroHeading: "", heroSubheading: "", aboutHeading: "", aboutDescription: "", missionHeading: "", missionDescription: "", stats: [], testimonials, footerTagline: "" },
    });
    revalidate();
    return { success: true, data: null, message: "Testimonials saved" };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to save" };
  }
}

export async function updateFooterSettings(
  data: unknown,
): Promise<ApiResponse<null>> {
  try {
    const parsed = footerSettingsSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: firstError(parsed.error.issues) };
    await prismaClient.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: parsed.data,
      create: { id: SETTINGS_ID, siteName: "", phone: "", email: "", whatsappNumber: "", address: "", heroEyebrow: "", heroHeading: "", heroSubheading: "", aboutHeading: "", aboutDescription: "", missionHeading: "", missionDescription: "", stats: [], testimonials: [], ...parsed.data },
    });
    revalidate();
    return { success: true, data: null, message: "Footer settings saved" };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to save" };
  }
}

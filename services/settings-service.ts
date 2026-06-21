import { cache } from "react";
import { prismaClient } from "@/lib/prisma";
import type { SiteSettingsData, StatItem, Testimonial } from "@/types";
import type { SiteSettingsModel } from "@/app/generated/prisma/models/SiteSettings";

function mapPrismaSettings(raw: SiteSettingsModel): SiteSettingsData {
  return {
    siteName: raw.siteName,
    phone: raw.phone,
    email: raw.email,
    whatsappNumber: raw.whatsappNumber,
    address: raw.address,
    heroEyebrow: raw.heroEyebrow,
    heroHeading: raw.heroHeading,
    heroSubheading: raw.heroSubheading,
    aboutHeading: raw.aboutHeading,
    aboutDescription: raw.aboutDescription,
    missionHeading: raw.missionHeading,
    missionDescription: raw.missionDescription,
    stats: raw.stats as unknown as StatItem[],
    testimonials: raw.testimonials as unknown as Testimonial[],
    footerTagline: raw.footerTagline,
  };
}

export class SettingsService {
  static async getSettings(): Promise<SiteSettingsData | null> {
    const raw = await prismaClient.siteSettings.findFirst({ where: { id: 1 } });
    return raw ? mapPrismaSettings(raw) : null;
  }

  static getCachedSettings = cache(
    async (): Promise<SiteSettingsData | null> => SettingsService.getSettings(),
  );
}

export const getSettings = () => SettingsService.getSettings();
export const getCachedSettings = cache(
  async (): Promise<SiteSettingsData | null> => SettingsService.getSettings(),
);

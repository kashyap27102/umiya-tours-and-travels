import type { MetadataRoute } from "next";
import { CORE_ROUTES } from "@/lib/constants";
import { appConfig } from "@/lib/config";
import { PackageService } from "@/services";

const SITE_URL = appConfig.siteUrl;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = CORE_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));

  const slugsResult = await PackageService.getActivePackageSlugs();
  const packagePages: MetadataRoute.Sitemap = (
    slugsResult.success ? slugsResult.data : []
  ).map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/packages/${slug}`,
    lastModified: updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...packagePages];
}

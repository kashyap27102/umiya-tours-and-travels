import type { MetadataRoute } from "next";
import { CORE_ROUTES } from "@/lib/constants";
import { appConfig } from "@/lib/config";
import { PackageService } from "@/services";
import { CatalogService } from "@/services/catalog-service";

const SITE_URL = appConfig.siteUrl;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = CORE_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority:
      route === "/"
        ? 1
        : route === "/privacy-policy" || route === "/terms"
          ? 0.3
          : 0.8,
  }));

  const [slugsResult, destinationSlugs, categorySlugs] = await Promise.all([
    PackageService.getActivePackageSlugs(),
    CatalogService.getDestinationSlugs(),
    CatalogService.getCategorySlugs(),
  ]);

  const packagePages: MetadataRoute.Sitemap = (
    slugsResult.success ? slugsResult.data : []
  ).map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/packages/${slug}`,
    lastModified: updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Only places and trip types that have a live package, so the sitemap never
  // lists a page that would be "not found".
  const destinationPages: MetadataRoute.Sitemap = destinationSlugs.map((slug) => ({
    url: `${SITE_URL}/destinations/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/categories/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...destinationPages, ...categoryPages, ...packagePages];
}

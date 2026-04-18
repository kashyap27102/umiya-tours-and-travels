import type { MetadataRoute } from "next";
import { CORE_ROUTES, PACKAGE_SLUGS, SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = CORE_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));

  const packagePages: MetadataRoute.Sitemap = PACKAGE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/packages/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...packagePages];
}

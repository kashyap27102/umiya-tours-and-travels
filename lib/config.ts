const normalizeUrl = (value: string) => value.replace(/\/$/, "");

const siteUrlFromEnv = process.env.NEXT_PUBLIC_SITE_URL;

export const appConfig = {
  siteUrl: normalizeUrl(siteUrlFromEnv || "https://umiyatoursandtravels.com"),
  featureFlags: {
    enablePackageFiltering: true,
    enablePackageSorting: true,
  },
} as const;

export type AppConfig = typeof appConfig;

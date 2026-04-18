const normalizeUrl = (value: string) => value.replace(/\/$/, "");

const siteUrlFromEnv = process.env.NEXT_PUBLIC_SITE_URL;

export const appConfig = {
  siteUrl: normalizeUrl(siteUrlFromEnv || "https://umiyatoursandtravels.com"),
  forms: {
    formspree: {
      cabBookingEndpoint: process.env.NEXT_PUBLIC_FORMSPREE_CAB || "",
      vehicleBookingEndpoint: process.env.NEXT_PUBLIC_FORMSPREE_VEHICLE || "",
      contactEndpoint: process.env.NEXT_PUBLIC_FORMSPREE_CONTACT || "",
      packageInquiryEndpoint: process.env.NEXT_PUBLIC_FORMSPREE_PACKAGE || "",
    },
  },
  featureFlags: {
    enablePackageFiltering: true,
    enablePackageSorting: true,
  },
} as const;

export type AppConfig = typeof appConfig;

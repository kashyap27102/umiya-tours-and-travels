export const PACKAGE_FORM_STEPS = [
  "Basic Details",
  "Media & Summary",
  "Package Features",
  "Itinerary",
  "Review",
] as const;

export type PackageFormStep = (typeof PACKAGE_FORM_STEPS)[number];

export type PackageMetaField = "highlights" | "inclusions" | "exclusions";

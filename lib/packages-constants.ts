export const PACKAGE_CATEGORIES = [
  "Beach",
  "Hill",
  "Heritage",
  "Pilgrimage",
  "International",
  "Honeymoon",
  "Family",
] as const;

export const PACKAGE_STATUS_OPTIONS = ["active", "inactive"] as const;

export const PACKAGE_SORT_OPTIONS = [
  "price-asc",
  "price-desc",
  "duration-asc",
  "duration-desc",
  "popular",
] as const;

export const PACKAGE_DURATION_BUCKETS = ["1-3", "4-6", "7-10", "11+"] as const;

export type PackageCategory = (typeof PACKAGE_CATEGORIES)[number];
export type PackageStatus = (typeof PACKAGE_STATUS_OPTIONS)[number];
export type PackageSortOption = (typeof PACKAGE_SORT_OPTIONS)[number];
export type PackageDurationBucket = (typeof PACKAGE_DURATION_BUCKETS)[number];

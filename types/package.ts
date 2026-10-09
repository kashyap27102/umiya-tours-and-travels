import type {
  Package,
  ItineraryItem,
  PackageVariant,
  VariantPrice,
  PackageStay,
  PackageDestination,
  PackageCategoryLink,
  PackageInclusion,
} from "@/app/generated/prisma/client";

export type PackageWithItinerary = Package & {
  itinerary: ItineraryItem[];
};

export type VariantWithDetails = PackageVariant & {
  prices: VariantPrice[];
  stays: PackageStay[];
};

/** A package with everything the admin edit form needs. */
export type PackageForEdit = PackageWithItinerary & {
  variants: VariantWithDetails[];
  destinations: PackageDestination[];
  categories: PackageCategoryLink[];
  inclusionLinks: PackageInclusion[];
};

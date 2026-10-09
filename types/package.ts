import type {
  Package,
  ItineraryItem,
  PackageVariant,
  VariantPrice,
  PackageStay,
  PackageDestination,
  PackageCategoryLink,
  PackageInclusion,
  PackageImage,
  MediaImage,
} from "@/app/generated/prisma/client";

export type PackageWithItinerary = Package & {
  itinerary: ItineraryItem[];
};

export type VariantWithDetails = PackageVariant & {
  prices: VariantPrice[];
  stays: PackageStay[];
};

/** A package as the public detail page needs it, including image alt text. */
export type PublicPackage = Omit<PackageWithItinerary, "itinerary"> & {
  itinerary: (ItineraryItem & { image: { alt: string } | null })[];
  imageLinks: { image: { url: string; alt: string } }[];
};

/** A package with everything the admin edit form needs. */
export type PackageForEdit = Omit<PackageWithItinerary, "itinerary"> & {
  itinerary: (ItineraryItem & { image: MediaImage | null })[];
  imageLinks: (PackageImage & { image: MediaImage })[];
  variants: VariantWithDetails[];
  destinations: PackageDestination[];
  categories: PackageCategoryLink[];
  inclusionLinks: PackageInclusion[];
};

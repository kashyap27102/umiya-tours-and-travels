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

/**
 * A package as the public list and cards need it. No itinerary: cards never
 * show it, and loading it for every package made the list slower.
 */
export type PackageSummary = Package;

export type PackageWithItinerary = Package & {
  itinerary: ItineraryItem[];
};

export type VariantWithDetails = PackageVariant & {
  prices: VariantPrice[];
  stays: PackageStay[];
};

/** One stay (a stop on the route) as customers see it. */
export interface PublicStay {
  id: string;
  nights: number;
  roomType: string | null;
  destinationName: string;
  hotelName: string;
  hotelStars: number | null;
}

/** A stay level (e.g. Deluxe / Premium) with its prices and stays. */
export interface PublicVariant {
  id: string;
  name: string;
  pricingMode: "flat" | "group_size";
  flatPrice: number | null;
  /** Per-person price by group size, smallest group first. */
  prices: { persons: number; pricePerPerson: number }[];
  stays: PublicStay[];
}

/** A package as the public detail page needs it, including image alt text. */
export type PublicPackage = Omit<PackageWithItinerary, "itinerary"> & {
  itinerary: (ItineraryItem & { image: { alt: string } | null })[];
  imageLinks: { image: { url: string; alt: string } }[];
  variants: PublicVariant[];
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

import type { Package, ItineraryItem } from "@/app/generated/prisma/client";

export type PackageWithItinerary = Package & {
  itinerary: ItineraryItem[];
};

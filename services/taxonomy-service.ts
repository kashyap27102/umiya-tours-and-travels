import { prismaClient } from "@/lib/prisma";
import type { ApiResponse } from "../types";
import type {
  Category,
  Destination,
  Hotel,
} from "@/app/generated/prisma/client";

export type DestinationWithHotels = Destination & { hotels: Hotel[] };

export class TaxonomyService {
  static async getDestinations(): Promise<
    ApiResponse<DestinationWithHotels[]>
  > {
    try {
      const data = await prismaClient.destination.findMany({
        include: { hotels: { orderBy: { name: "asc" } } },
        orderBy: { name: "asc" },
      });
      return { success: true, data, message: "Destinations fetched" };
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
      return { success: false, error: "Failed to load destinations." };
    }
  }

  static async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const data = await prismaClient.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      });
      return { success: true, data, message: "Categories fetched" };
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return { success: false, error: "Failed to load categories." };
    }
  }
}

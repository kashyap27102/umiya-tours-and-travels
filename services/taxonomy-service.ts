import { prismaClient } from "@/lib/prisma";
import type { ApiResponse } from "../types";
import type { Category, Destination } from "@/app/generated/prisma/client";

export class TaxonomyService {
  static async getDestinations(): Promise<ApiResponse<Destination[]>> {
    try {
      const data = await prismaClient.destination.findMany({
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

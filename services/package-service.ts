import { cache } from "react";
import { prismaClient } from "@/lib/prisma";
import { PackageWithItinerary, ApiResponse } from "../types";
import type {
  PackageCategory,
  PackageStatus,
} from "@/app/generated/prisma/client";

const DEFAULT_PAGE_SIZE = 10;

export interface PackageFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedPackages {
  packages: PackageWithItinerary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class PackageService {
  static async getAllPackages(): Promise<ApiResponse<PackageWithItinerary[]>> {
    try {
      const packages = await prismaClient.package.findMany({
        include: {
          itinerary: {
            orderBy: {
              day: "asc",
            },
          },
        },
      });

      return {
        success: true,
        data: packages,
        message: "Packages fetched successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch packages";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  static async getPackageById(
    id: string,
  ): Promise<ApiResponse<PackageWithItinerary | null>> {
    try {
      const packageData = await prismaClient.package.findUnique({
        where: { id },
        include: {
          itinerary: {
            orderBy: {
              day: "asc",
            },
          },
        },
      });

      if (!packageData) {
        return {
          success: false,
          error: "Package not found",
        };
      }

      return {
        success: true,
        data: packageData,
        message: "Package fetched successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch package";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  static async getPackageBySlug(
    slug: string,
  ): Promise<ApiResponse<PackageWithItinerary | null>> {
    try {
      const packageData = await prismaClient.package.findUnique({
        where: { slug },
        include: {
          itinerary: {
            orderBy: {
              day: "asc",
            },
          },
        },
      });

      if (!packageData) {
        return {
          success: false,
          error: "Package not found",
        };
      }

      return {
        success: true,
        data: packageData,
        message: "Package fetched successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch package";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  static async getPackages(
    filters: PackageFilters = {},
  ): Promise<ApiResponse<PaginatedPackages>> {
    try {
      const {
        search,
        category,
        status,
        page = 1,
        pageSize = DEFAULT_PAGE_SIZE,
      } = filters;

      const where = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { destination: { contains: search, mode: "insensitive" as const } },
          ],
        }),
        ...(category && { category: category as PackageCategory }),
        ...(status && { status: status as PackageStatus }),
      };

      const [packages, total] = await Promise.all([
        prismaClient.package.findMany({
          where,
          include: {
            itinerary: { orderBy: { day: "asc" } },
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        }),
        prismaClient.package.count({ where }),
      ]);

      return {
        success: true,
        data: {
          packages,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
        message: "Packages fetched successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch packages";
      return { success: false, error: errorMessage };
    }
  }

  static async getActivePackages(): Promise<
    ApiResponse<PackageWithItinerary[]>
  > {
    try {
      const packages = await prismaClient.package.findMany({
        where: {
          status: "active",
        },
        include: {
          itinerary: {
            orderBy: {
              day: "asc",
            },
          },
        },
      });

      return {
        success: true,
        data: packages,
        message: "Active packages fetched successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch active packages";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  static getCachedActivePackages = cache(() => PackageService.getActivePackages());

  static getCachedPackageBySlug = cache((slug: string) =>
    PackageService.getPackageBySlug(slug),
  );

  static async getRelatedPackages(
    category: PackageCategory,
    excludeSlug: string,
    limit = 3,
  ): Promise<ApiResponse<PackageWithItinerary[]>> {
    try {
      const packages = await prismaClient.package.findMany({
        where: {
          category,
          status: "active",
          slug: { not: excludeSlug },
        },
        include: {
          itinerary: {
            orderBy: {
              day: "asc",
            },
          },
        },
        take: limit,
      });

      return {
        success: true,
        data: packages,
        message: "Related packages fetched successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch related packages";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  static async getActivePackageSlugs(): Promise<
    ApiResponse<{ slug: string; updatedAt: Date }[]>
  > {
    try {
      const slugs = await prismaClient.package.findMany({
        where: { status: "active" },
        select: { slug: true, updatedAt: true },
      });

      return {
        success: true,
        data: slugs,
        message: "Package slugs fetched successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch package slugs";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

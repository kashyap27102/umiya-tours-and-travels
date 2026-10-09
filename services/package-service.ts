import { cache } from "react";
import { prismaClient } from "@/lib/prisma";
import {
  PackageWithItinerary,
  PackageForEdit,
  PublicPackage,
  ApiResponse,
} from "../types";
import type {
  PackageCategory,
  PackageStatus,
} from "@/app/generated/prisma/client";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export interface PackageFilters {
  search?: string;
  /** Destination slug. */
  destination?: string;
  /** Category slug. */
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
  ): Promise<ApiResponse<PublicPackage | null>> {
    try {
      const packageData = await prismaClient.package.findUnique({
        where: { slug },
        include: {
          itinerary: {
            orderBy: {
              day: "asc",
            },
            include: { image: { select: { alt: true } } },
          },
          imageLinks: {
            orderBy: { sortOrder: "asc" },
            select: { image: { select: { url: true, alt: true } } },
          },
          variants: {
            orderBy: { sortOrder: "asc" },
            include: {
              prices: { orderBy: { persons: "asc" } },
              stays: {
                orderBy: { sortOrder: "asc" },
                include: {
                  hotel: { select: { name: true, starRating: true } },
                  destination: { select: { name: true } },
                },
              },
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

      // Only what customers need; ids and internal fields stay on the server.
      const { variants, ...rest } = packageData;
      return {
        success: true,
        data: {
          ...rest,
          variants: variants.map((variant) => ({
            id: variant.id,
            name: variant.name,
            pricingMode: variant.pricingMode,
            flatPrice: variant.flatPrice,
            prices: variant.prices.map(({ persons, pricePerPerson }) => ({
              persons,
              pricePerPerson,
            })),
            stays: variant.stays.map((stay) => ({
              id: stay.id,
              nights: stay.nights,
              roomType: stay.roomType,
              destinationName: stay.destination.name,
              hotelName: stay.hotel.name,
              hotelStars: stay.hotel.starRating,
            })),
          })),
        },
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

  static async getPackageForEdit(
    slug: string,
  ): Promise<ApiResponse<PackageForEdit>> {
    try {
      const packageData = await prismaClient.package.findUnique({
        where: { slug },
        include: {
          itinerary: { orderBy: { day: "asc" }, include: { image: true } },
          imageLinks: {
            orderBy: { sortOrder: "asc" },
            include: { image: true },
          },
          destinations: { orderBy: { sortOrder: "asc" } },
          categories: { orderBy: { sortOrder: "asc" } },
          inclusionLinks: { orderBy: { sortOrder: "asc" } },
          variants: {
            orderBy: { sortOrder: "asc" },
            include: {
              prices: { orderBy: { persons: "asc" } },
              stays: { orderBy: { sortOrder: "asc" } },
            },
          },
        },
      });

      if (!packageData) {
        return { success: false, error: "Package not found" };
      }

      return {
        success: true,
        data: packageData,
        message: "Package fetched successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch package";
      return { success: false, error: errorMessage };
    }
  }

  static async getPackages(
    filters: PackageFilters = {},
  ): Promise<ApiResponse<PaginatedPackages>> {
    try {
      const {
        destination,
        category,
        status,
        page = 1,
      } = filters;
      const search = filters.search?.trim();
      const pageSize = Math.min(
        Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE),
        MAX_PAGE_SIZE,
      );

      const where = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { destination: { contains: search, mode: "insensitive" as const } },
          ],
        }),
        ...(destination && {
          destinations: {
            some: { destination: { slug: destination.toLowerCase() } },
          },
        }),
        ...(category && {
          categories: {
            some: { category: { slug: category.toLowerCase() } },
          },
        }),
        ...(status && { status: status as PackageStatus }),
      };

      const fetchPage = (pageNumber: number) =>
        prismaClient.package.findMany({
          where,
          include: {
            itinerary: { orderBy: { day: "asc" } },
          },
          skip: (pageNumber - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        });

      const [firstFetch, total] = await Promise.all([
        fetchPage(page),
        prismaClient.package.count({ where }),
      ]);
      let packages = firstFetch;

      // A page past the end (e.g. the last row of the last page was deleted)
      // falls back to the last page that exists instead of showing nothing.
      const totalPages = Math.ceil(total / pageSize);
      let currentPage = page;
      if (total > 0 && page > totalPages) {
        currentPage = totalPages;
        packages = await fetchPage(currentPage);
      }

      return {
        success: true,
        data: {
          packages,
          total,
          page: currentPage,
          pageSize,
          totalPages,
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
    category: PackageCategory | null,
    excludeSlug: string,
    limit = 3,
  ): Promise<ApiResponse<PackageWithItinerary[]>> {
    try {
      const packages = await prismaClient.package.findMany({
        where: {
          // Packages without a legacy category fall back to any other active package.
          ...(category && { category }),
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

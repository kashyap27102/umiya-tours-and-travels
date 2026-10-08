"use server";

import { revalidatePath } from "next/cache";
import { prismaClient } from "@/lib/prisma";
import { packageFormSchema, type PackageFormValues } from "@/schemas/package";
import type { ApiResponse } from "@/types/api-response";

export async function createPackage(
  input: PackageFormValues,
): Promise<ApiResponse<{ id: string; slug: string }>> {
  const parsed = packageFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the package details and try again.",
    };
  }
  const data = parsed.data;

  try {
    // Generate slug from package name
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    // Check if slug already exists
    const existing = await prismaClient.package.findUnique({
      where: { slug },
    });

    if (existing) {
      return {
        success: false,
        error:
          "A package with this name already exists. Please use a different name.",
      };
    }

    const pkg = await prismaClient.package.create({
      data: {
        name: data.name,
        slug,
        destination: data.destination,
        category: data.category,
        status: data.status,
        durationDays: data.durationDays,
        durationNights: data.durationNights,
        pricePerPerson: data.pricePerPerson,
        images: data.images,
        summary: data.summary,
        highlights: data.highlights.filter(Boolean),
        inclusions: data.inclusions.filter(Boolean),
        exclusions: data.exclusions.filter(Boolean),
        itinerary: {
          create: data.itinerary.map((item) => ({
            day: item.day,
            title: item.title,
            description: item.description,
          })),
        },
      },
    });

    // Revalidate the package listing page
    revalidatePath("/admin/package-management");
    revalidatePath("/packages");
    revalidatePath("/");

    return {
      success: true,
      data: { id: pkg.id, slug: pkg.slug },
      message: "Package created successfully",
    };
  } catch (error) {
    console.error("Failed to create package:", error);
    return {
      success: false,
      error: "Failed to create package. Please try again.",
    };
  }
}

export async function editPackage(
  packageId: string,
  input: PackageFormValues,
): Promise<ApiResponse<{ id: string; slug: string }>> {
  const parsed = packageFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the package details and try again.",
    };
  }
  const data = parsed.data;

  try {
    const existingPackage = await prismaClient.package.findUnique({
      where: { id: packageId },
    });

    if (!existingPackage) {
      return {
        success: false,
        error: "Package not found",
      };
    }

    // Update package
    const updatedPackage = await prismaClient.package.update({
      where: { id: packageId },
      data: {
        name: data.name,
        destination: data.destination,
        category: data.category,
        status: data.status,
        durationDays: data.durationDays,
        durationNights: data.durationNights,
        pricePerPerson: data.pricePerPerson,
        images: data.images,
        summary: data.summary,
        highlights: data.highlights.filter(Boolean),
        inclusions: data.inclusions.filter(Boolean),
        exclusions: data.exclusions.filter(Boolean),
      },
    });

    // Remove old itinerary items
    await prismaClient.itineraryItem.deleteMany({
      where: { packageId },
    });

    // Create new itinerary items
    await prismaClient.itineraryItem.createMany({
      data: data.itinerary.map((item) => ({
        day: item.day,
        title: item.title,
        description: item.description,
        packageId,
      })),
    });

    // Revalidate both the listing and the detail page
    revalidatePath("/admin/package-management");
    revalidatePath(`/admin/package-management/${updatedPackage.slug}/edit`);
    revalidatePath("/packages");
    revalidatePath(`/packages/${updatedPackage.slug}`);
    revalidatePath("/");

    return {
      success: true,
      data: { id: updatedPackage.id, slug: updatedPackage.slug },
      message: "Package updated successfully",
    };
  } catch (error) {
    console.error("Failed to update package:", error);
    return {
      success: false,
      error: "Failed to update package. Please try again.",
    };
  }
}

export async function deletePackage(
  packageId: string,
): Promise<ApiResponse<null>> {
  try {
    const pkg = await prismaClient.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return {
        success: false,
        error: "Package not found",
      };
    }

    // Delete related itinerary items (cascade should handle this, but being explicit)
    await prismaClient.itineraryItem.deleteMany({
      where: { packageId },
    });

    // Delete the package
    await prismaClient.package.delete({
      where: { id: packageId },
    });

    // Revalidate the listing page
    revalidatePath("/admin/package-management");
    revalidatePath("/packages");
    revalidatePath(`/packages/${pkg.slug}`);
    revalidatePath("/");

    return {
      success: true,
      data: null,
      message: "Package deleted successfully",
    };
  } catch (error) {
    console.error("Failed to delete package:", error);
    return {
      success: false,
      error: "Failed to delete package. Please try again.",
    };
  }
}

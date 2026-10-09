"use server";

import { revalidatePath } from "next/cache";
import { prismaClient } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import {
  resolveInclusions,
  resolvePackageLinks,
} from "@/services/package-links-service";
import {
  startingPriceOf,
  toVariantCreateInput,
  validateVariants,
} from "@/services/package-variant-service";
import { packageFormSchema, type PackageFormValues } from "@/schemas/package";
import { normalizeDraft } from "@/schemas/package-draft";
import type { ApiResponse } from "@/types/api-response";

const UNAUTHORIZED = "You must be signed in as an admin.";

/**
 * Drafts only need a name (the rest is cleaned up, not enforced). Anything else
 * must pass the full rules, which is what stops half-finished packages going live.
 */
function parsePackageInput(
  input: PackageFormValues,
): { error: string } | { data: PackageFormValues } {
  if (input?.status === "draft") return normalizeDraft(input);

  const parsed = packageFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Please check the package details and try again.",
    };
  }
  return { data: parsed.data };
}

export async function createPackage(
  input: PackageFormValues,
): Promise<ApiResponse<{ id: string; slug: string }>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = parsePackageInput(input);
  if ("error" in parsed) return { success: false, error: parsed.error };
  const data = parsed.data;

  try {
    const variantError = await validateVariants(
      data.variants,
      data.durationNights,
      { checkNights: data.status !== "draft" },
    );
    if (variantError) return { success: false, error: variantError };
    const links = await resolvePackageLinks(data.destinationIds, data.categoryIds);
    if ("error" in links) return { success: false, error: links.error };
    const inclusionData = await resolveInclusions(
      data.inclusionIds,
      data.exclusionIds,
    );
    if ("error" in inclusionData) {
      return { success: false, error: inclusionData.error };
    }
    const startingPrice = startingPriceOf(data.variants);

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
        destination: links.destination,
        category: links.category,
        destinations: { create: links.destinationLinks },
        categories: { create: links.categoryLinks },
        status: data.status,
        durationDays: data.durationDays,
        durationNights: data.durationNights,
        // pricePerPerson is the legacy column the public pages still read;
        // keep it equal to the lowest variant price until they are switched over.
        pricePerPerson: startingPrice,
        startingPrice,
        variants: { create: toVariantCreateInput(data.variants) },
        images: data.images,
        summary: data.summary,
        highlights: data.highlights.filter(Boolean),
        inclusions: inclusionData.inclusions,
        exclusions: inclusionData.exclusions,
        inclusionLinks: { create: inclusionData.links },
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
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = parsePackageInput(input);
  if ("error" in parsed) return { success: false, error: parsed.error };
  const data = parsed.data;

  try {
    const variantError = await validateVariants(
      data.variants,
      data.durationNights,
      { checkNights: data.status !== "draft" },
    );
    if (variantError) return { success: false, error: variantError };
    const links = await resolvePackageLinks(data.destinationIds, data.categoryIds);
    if ("error" in links) return { success: false, error: links.error };
    const inclusionData = await resolveInclusions(
      data.inclusionIds,
      data.exclusionIds,
    );
    if ("error" in inclusionData) {
      return { success: false, error: inclusionData.error };
    }
    const startingPrice = startingPriceOf(data.variants);

    const existingPackage = await prismaClient.package.findUnique({
      where: { id: packageId },
    });

    if (!existingPackage) {
      return {
        success: false,
        error: "Package not found",
      };
    }

    // Update the package, itinerary and variants together so a failure part-way
    // can't leave a half-saved package.
    const updatedPackage = await prismaClient.$transaction(async (tx) => {
      const updated = await tx.package.update({
        where: { id: packageId },
        data: {
          name: data.name,
          destination: links.destination,
          category: links.category,
          status: data.status,
          durationDays: data.durationDays,
          durationNights: data.durationNights,
          // Legacy column the public pages still read; mirrors the lowest variant price.
          pricePerPerson: startingPrice,
          startingPrice,
          images: data.images,
          summary: data.summary,
          highlights: data.highlights.filter(Boolean),
          inclusions: inclusionData.inclusions,
          exclusions: inclusionData.exclusions,
        },
      });

      await tx.packageInclusion.deleteMany({ where: { packageId } });
      await tx.packageInclusion.createMany({
        data: inclusionData.links.map((l) => ({ ...l, packageId })),
      });

      await tx.itineraryItem.deleteMany({ where: { packageId } });
      await tx.itineraryItem.createMany({
        data: data.itinerary.map((item) => ({
          day: item.day,
          title: item.title,
          description: item.description,
          packageId,
        })),
      });

      // Destination and category links are replaced wholesale too.
      await tx.packageDestination.deleteMany({ where: { packageId } });
      await tx.packageDestination.createMany({
        data: links.destinationLinks.map((l) => ({ ...l, packageId })),
      });
      await tx.packageCategoryLink.deleteMany({ where: { packageId } });
      await tx.packageCategoryLink.createMany({
        data: links.categoryLinks.map((l) => ({ ...l, packageId })),
      });

      // Variants are replaced wholesale; stays and prices cascade with them.
      await tx.packageVariant.deleteMany({ where: { packageId } });
      for (const variant of toVariantCreateInput(data.variants)) {
        await tx.packageVariant.create({
          data: { ...variant, package: { connect: { id: packageId } } },
        });
      }

      return updated;
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
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

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

/**
 * Quick Active / Inactive switch from the package list. Drafts can't be
 * switched here: publishing a draft needs the full checks in the edit form.
 */
export async function setPackageStatus(
  packageId: string,
  status: "active" | "inactive",
): Promise<ApiResponse<{ status: "active" | "inactive" }>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  if (status !== "active" && status !== "inactive") {
    return { success: false, error: "Invalid status." };
  }

  try {
    const pkg = await prismaClient.package.findUnique({
      where: { id: packageId },
      select: { slug: true, status: true },
    });
    if (!pkg) return { success: false, error: "Package not found." };
    if (pkg.status === "draft") {
      return {
        success: false,
        error: "Drafts must be published from the edit page.",
      };
    }

    await prismaClient.package.update({
      where: { id: packageId },
      data: { status },
    });

    revalidatePath("/admin/package-management");
    revalidatePath("/packages");
    revalidatePath(`/packages/${pkg.slug}`);
    revalidatePath("/");

    return {
      success: true,
      data: { status },
      message: `Package is now ${status}`,
    };
  } catch (error) {
    console.error("Failed to change package status:", error);
    return { success: false, error: "Failed to change status. Please try again." };
  }
}

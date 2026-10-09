"use server";

import { revalidatePath } from "next/cache";
import { prismaClient } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { slugify } from "@/lib/slug";
import {
  categorySchema,
  destinationSchema,
  type CategoryFormInput,
  type DestinationFormInput,
} from "@/schemas/taxonomy";
import type { ApiResponse } from "@/types/api-response";

const UNAUTHORIZED = "You must be signed in as an admin.";

function isForeignKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === "P2003"
  );
}

/* ── Destinations ─────────────────────────────────────────────────────────── */

export async function createDestination(
  input: DestinationFormInput,
): Promise<ApiResponse<{ id: string }>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = destinationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const data = parsed.data;
  const slug = slugify(data.name);
  if (!slug) return { success: false, error: "Enter a valid name." };

  try {
    const existing = await prismaClient.destination.findUnique({
      where: { slug },
    });
    if (existing) {
      return {
        success: false,
        error: `A destination named "${existing.name}" already exists.`,
      };
    }

    const created = await prismaClient.destination.create({
      data: { ...data, slug },
    });
    revalidatePath("/admin/destinations");
    return {
      success: true,
      data: { id: created.id },
      message: "Destination created",
    };
  } catch (error) {
    console.error("Failed to create destination:", error);
    return { success: false, error: "Failed to create destination." };
  }
}

export async function updateDestination(
  id: string,
  input: DestinationFormInput,
): Promise<ApiResponse<{ id: string }>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = destinationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  try {
    const duplicate = await prismaClient.destination.findFirst({
      where: {
        id: { not: id },
        name: { equals: data.name, mode: "insensitive" },
      },
    });
    if (duplicate) {
      return {
        success: false,
        error: `A destination named "${duplicate.name}" already exists.`,
      };
    }

    // The slug is left unchanged on rename so existing links stay stable.
    await prismaClient.destination.update({ where: { id }, data });
    revalidatePath("/admin/destinations");
    return { success: true, data: { id }, message: "Destination updated" };
  } catch (error) {
    console.error("Failed to update destination:", error);
    return { success: false, error: "Failed to update destination." };
  }
}

export async function deleteDestination(
  id: string,
): Promise<ApiResponse<null>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  try {
    await prismaClient.destination.delete({ where: { id } });
    revalidatePath("/admin/destinations");
    return { success: true, data: null, message: "Destination deleted" };
  } catch (error) {
    if (isForeignKeyError(error)) {
      return {
        success: false,
        error: "This destination is used by a package and can't be deleted.",
      };
    }
    console.error("Failed to delete destination:", error);
    return { success: false, error: "Failed to delete destination." };
  }
}

/* ── Categories ───────────────────────────────────────────────────────────── */

export async function createCategory(
  input: CategoryFormInput,
): Promise<ApiResponse<{ id: string }>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const data = parsed.data;
  const slug = slugify(data.name);
  if (!slug) return { success: false, error: "Enter a valid name." };

  try {
    const existing = await prismaClient.category.findUnique({ where: { slug } });
    if (existing) {
      return {
        success: false,
        error: `A category named "${existing.name}" already exists.`,
      };
    }

    const created = await prismaClient.category.create({
      data: { ...data, slug },
    });
    revalidatePath("/admin/categories");
    return {
      success: true,
      data: { id: created.id },
      message: "Category created",
    };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Failed to create category." };
  }
}

export async function updateCategory(
  id: string,
  input: CategoryFormInput,
): Promise<ApiResponse<{ id: string }>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  try {
    const duplicate = await prismaClient.category.findFirst({
      where: {
        id: { not: id },
        name: { equals: data.name, mode: "insensitive" },
      },
    });
    if (duplicate) {
      return {
        success: false,
        error: `A category named "${duplicate.name}" already exists.`,
      };
    }

    await prismaClient.category.update({ where: { id }, data });
    revalidatePath("/admin/categories");
    return { success: true, data: { id }, message: "Category updated" };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Failed to update category." };
  }
}

export async function deleteCategory(id: string): Promise<ApiResponse<null>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  try {
    await prismaClient.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true, data: null, message: "Category deleted" };
  } catch (error) {
    if (isForeignKeyError(error)) {
      return {
        success: false,
        error: "This category is used by a package and can't be deleted.",
      };
    }
    console.error("Failed to delete category:", error);
    return { success: false, error: "Failed to delete category." };
  }
}

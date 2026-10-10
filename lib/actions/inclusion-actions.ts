"use server";

import { revalidatePath } from "next/cache";
import { prismaClient } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { isForeignKeyError } from "@/lib/db-errors";
import { inclusionSchema, type InclusionFormInput } from "@/schemas/taxonomy";
import {
  InclusionNotFoundError,
  renameInclusion,
} from "@/services/inclusion-service";
import type { ApiResponse } from "@/types/api-response";

const UNAUTHORIZED = "You must be signed in as an admin.";

export async function createInclusion(
  input: InclusionFormInput,
): Promise<ApiResponse<{ id: string; text: string }>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = inclusionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { text } = parsed.data;

  try {
    const duplicate = await prismaClient.inclusion.findFirst({
      where: { text: { equals: text, mode: "insensitive" } },
    });
    if (duplicate) {
      return {
        success: false,
        error: `"${duplicate.text}" already exists in the list.`,
      };
    }

    const created = await prismaClient.inclusion.create({ data: { text } });
    revalidatePath("/admin/inclusions");
    return {
      success: true,
      data: { id: created.id, text: created.text },
      message: "Item added",
    };
  } catch (error) {
    console.error("Failed to create inclusion:", error);
    return { success: false, error: "Failed to add item." };
  }
}

export async function updateInclusion(
  id: string,
  input: InclusionFormInput,
): Promise<ApiResponse<{ id: string }>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = inclusionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { text } = parsed.data;

  try {
    const duplicate = await prismaClient.inclusion.findFirst({
      where: { id: { not: id }, text: { equals: text, mode: "insensitive" } },
    });
    if (duplicate) {
      return {
        success: false,
        error: `"${duplicate.text}" already exists in the list.`,
      };
    }

    await renameInclusion(id, text);

    revalidatePath("/admin/inclusions");
    revalidatePath("/packages", "layout");
    return { success: true, data: { id }, message: "Item updated" };
  } catch (error) {
    if (error instanceof InclusionNotFoundError) {
      return { success: false, error: "Item not found." };
    }
    console.error("Failed to update inclusion:", error);
    return { success: false, error: "Failed to update item." };
  }
}

export async function deleteInclusion(id: string): Promise<ApiResponse<null>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  try {
    await prismaClient.inclusion.delete({ where: { id } });
    revalidatePath("/admin/inclusions");
    return { success: true, data: null, message: "Item deleted" };
  } catch (error) {
    if (isForeignKeyError(error)) {
      return {
        success: false,
        error: "This item is used by a package. Remove it from those packages first.",
      };
    }
    console.error("Failed to delete inclusion:", error);
    return { success: false, error: "Failed to delete item." };
  }
}

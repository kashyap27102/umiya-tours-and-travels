"use server";

import { revalidatePath } from "next/cache";
import { prismaClient } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { fileExtension, titleFromFileName } from "@/lib/media";
import { storeImage } from "@/lib/media-storage";
import { SafeFetchError, downloadImage } from "@/lib/safe-image-fetch";
import {
  linkImportSchema,
  mediaDetailsSchema,
  type LinkImportInput,
  type MediaDetailsInput,
} from "@/schemas/media";
import { MediaService, type MediaItem } from "@/services/media-service";
import type { ApiResponse } from "@/types/api-response";

const UNAUTHORIZED = "You must be signed in as an admin.";

/**
 * Copies an image from a pasted link into our own storage and adds it to the
 * library. If that link was imported before, the existing image is returned.
 */
export async function importImageFromLink(
  input: LinkImportInput,
): Promise<ApiResponse<MediaItem>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = linkImportSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { url, title } = parsed.data;

  try {
    const already = await prismaClient.mediaImage.findFirst({
      where: { sourceUrl: url },
      select: { id: true },
    });
    if (already) {
      const existing = await MediaService.getById(already.id);
      if (existing) {
        return {
          success: true,
          data: existing,
          message: "That link is already in the gallery",
        };
      }
    }

    const { bytes, contentType } = await downloadImage(url);

    let nameFromLink = "";
    try {
      nameFromLink = decodeURIComponent(
        new URL(url).pathname.split("/").filter(Boolean).pop() ?? "",
      );
    } catch {
      // keep the fallback title
    }
    const finalTitle =
      title || titleFromFileName(nameFromLink) || "Linked image";
    const slug =
      finalTitle
        .replace(/[^a-z0-9]+/gi, "-")
        .toLowerCase()
        .replace(/^-|-$/g, "") || "image";

    const storedUrl = await storeImage(
      bytes,
      `gallery/${slug}.${fileExtension(contentType)}`,
      contentType,
    );
    const row = await prismaClient.mediaImage.create({
      data: {
        url: storedUrl,
        title: finalTitle,
        alt: "",
        source: "link_copy",
        sourceUrl: url,
        sizeBytes: bytes.length,
      },
    });

    revalidatePath("/admin/gallery");
    const item = await MediaService.getById(row.id);
    if (!item) {
      return { success: false, error: "Saved, but could not load it back." };
    }
    return { success: true, data: item, message: "Image added to the gallery" };
  } catch (error) {
    if (error instanceof SafeFetchError) {
      return { success: false, error: error.message };
    }
    console.error("Failed to import image from link:", error);
    return {
      success: false,
      error: "Could not add that image. Please try again.",
    };
  }
}

export async function updateMedia(
  id: string,
  input: MediaDetailsInput,
): Promise<ApiResponse<MediaItem>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = mediaDetailsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const exists = await prismaClient.mediaImage.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return { success: false, error: "Image not found." };

    await prismaClient.mediaImage.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/gallery");
    // Alt text is shown on the public package pages.
    revalidatePath("/packages", "layout");

    const item = await MediaService.getById(id);
    if (!item) return { success: false, error: "Image not found." };
    return { success: true, data: item, message: "Image updated" };
  } catch (error) {
    console.error("Failed to update image:", error);
    return { success: false, error: "Failed to update the image." };
  }
}

export async function deleteMedia(id: string): Promise<ApiResponse<null>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  try {
    const result = await MediaService.delete(id);
    if (result.ok) {
      revalidatePath("/admin/gallery");
      return { success: true, data: null, message: "Image deleted" };
    }
    if (result.reason === "not_found") {
      return { success: false, error: "Image not found." };
    }
    const { packages, itineraryDays } = result.usage;
    const parts = [
      packages.length > 0 &&
        `${packages.length} package${packages.length === 1 ? "" : "s"}`,
      itineraryDays.length > 0 &&
        `${itineraryDays.length} itinerary day${itineraryDays.length === 1 ? "" : "s"}`,
    ].filter(Boolean);
    return {
      success: false,
      error: `This image is used in ${parts.join(" and ")}. Remove it from there first.`,
    };
  } catch (error) {
    console.error("Failed to delete image:", error);
    return { success: false, error: "Failed to delete the image." };
  }
}

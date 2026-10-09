import { prismaClient } from "@/lib/prisma";
import { removeStoredImage } from "@/lib/media-storage";
import type { MediaSource } from "@/app/generated/prisma/client";

import { DEFAULT_GALLERY_PAGE_SIZE } from "@/lib/media";

const MAX_PAGE_SIZE = 100;

/** An image as the gallery and picker show it. */
export interface MediaItem {
  id: string;
  url: string;
  title: string;
  alt: string;
  tags: string[];
  source: MediaSource;
  createdAt: string;
  /** Packages + itinerary days currently using it. */
  usageCount: number;
}

export interface MediaPage {
  items: MediaItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MediaUsage {
  packages: { id: string; name: string; slug: string; status: string }[];
  itineraryDays: { packageName: string; packageSlug: string; day: number }[];
}

const withUsage = {
  _count: { select: { packageLinks: true, itineraryDays: true } },
} as const;

export class MediaService {
  static async list({
    q,
    tag,
    page = 1,
    pageSize = DEFAULT_GALLERY_PAGE_SIZE,
  }: {
    q?: string;
    tag?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<MediaPage> {
    const size = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
    const search = q?.trim();
    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { alt: { contains: search, mode: "insensitive" as const } },
          { tags: { has: search.toLowerCase() } },
        ],
      }),
      ...(tag && { tags: { has: tag.trim().toLowerCase() } }),
    };

    const [total, firstRows] = await Promise.all([
      prismaClient.mediaImage.count({ where }),
      prismaClient.mediaImage.findMany({
        where,
        include: withUsage,
        orderBy: { createdAt: "desc" },
        skip: (Math.max(1, page) - 1) * size,
        take: size,
      }),
    ]);

    // A page past the end falls back to the last page that exists.
    const totalPages = Math.max(1, Math.ceil(total / size));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const rows =
      currentPage === Math.max(1, page)
        ? firstRows
        : await prismaClient.mediaImage.findMany({
            where,
            include: withUsage,
            orderBy: { createdAt: "desc" },
            skip: (currentPage - 1) * size,
            take: size,
          });

    return {
      items: rows.map(toItem),
      total,
      page: currentPage,
      pageSize: size,
      totalPages,
    };
  }

  /** Every tag in use with how many images carry it, most used first. */
  static async getTags(): Promise<{ tag: string; count: number }[]> {
    const rows = await prismaClient.mediaImage.findMany({
      select: { tags: true },
    });
    const counts = new Map<string, number>();
    for (const row of rows) {
      for (const tag of row.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }

  static async getById(id: string): Promise<MediaItem | null> {
    const row = await prismaClient.mediaImage.findUnique({
      where: { id },
      include: withUsage,
    });
    return row ? toItem(row) : null;
  }

  /** Where an image is used, with enough detail to link to the packages. */
  static async getUsage(id: string): Promise<MediaUsage> {
    const [packageLinks, days] = await Promise.all([
      prismaClient.packageImage.findMany({
        where: { imageId: id },
        include: {
          package: { select: { id: true, name: true, slug: true, status: true } },
        },
      }),
      prismaClient.itineraryItem.findMany({
        where: { imageId: id },
        include: { package: { select: { name: true, slug: true } } },
        orderBy: [{ packageId: "asc" }, { day: "asc" }],
      }),
    ]);
    return {
      packages: packageLinks.map((l) => l.package),
      itineraryDays: days.map((d) => ({
        packageName: d.package.name,
        packageSlug: d.package.slug,
        day: d.day,
      })),
    };
  }

  /**
   * Deletes an image from the library (and its stored file when it is ours).
   * Refuses, and says where it is used, if any package or itinerary day still
   * uses it.
   */
  static async delete(
    id: string,
  ): Promise<
    | { ok: true }
    | { ok: false; reason: "not_found" }
    | { ok: false; reason: "in_use"; usage: MediaUsage }
  > {
    const image = await prismaClient.mediaImage.findUnique({ where: { id } });
    if (!image) return { ok: false, reason: "not_found" };

    const usage = await MediaService.getUsage(id);
    if (usage.packages.length > 0 || usage.itineraryDays.length > 0) {
      return { ok: false, reason: "in_use", usage };
    }

    await prismaClient.mediaImage.delete({ where: { id } });
    // Row first: if the file removal fails we keep an orphan file rather than a
    // library entry pointing at nothing.
    await removeStoredImage(image.url).catch((error) =>
      console.error("Failed to remove stored image file:", error),
    );
    return { ok: true };
  }
}

function toItem(
  row: {
    id: string;
    url: string;
    title: string;
    alt: string;
    tags: string[];
    source: MediaSource;
    createdAt: Date;
    _count: { packageLinks: number; itineraryDays: number };
  },
): MediaItem {
  const { _count, ...rest } = row;
  return {
    ...rest,
    createdAt: rest.createdAt.toISOString(),
    usageCount: _count.packageLinks + _count.itineraryDays,
  };
}

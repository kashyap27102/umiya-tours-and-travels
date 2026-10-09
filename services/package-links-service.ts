import { prismaClient } from "@/lib/prisma";
import { PACKAGE_CATEGORIES } from "@/lib/packages-constants";
import type { PackageCategory } from "@/app/generated/prisma/client";

export interface ResolvedPackageLinks {
  /** Legacy text field the public pages still read: "Jaipur - Jodhpur - Udaipur". */
  destination: string;
  /** Legacy enum: first selected category that is one of the original seven. */
  category: PackageCategory | null;
  destinationLinks: { destinationId: string; isPrimary: boolean; sortOrder: number }[];
  categoryLinks: { categoryId: string; sortOrder: number }[];
}

/**
 * Turns the selected destination/category ids (in pick order) into the link
 * rows to store plus the legacy `destination` / `category` values.
 * Returns an error message if any id no longer exists.
 */
export async function resolvePackageLinks(
  destinationIds: string[],
  categoryIds: string[],
): Promise<{ error: string } | ResolvedPackageLinks> {
  const uniqueDestinationIds = [...new Set(destinationIds)];
  const uniqueCategoryIds = [...new Set(categoryIds)];

  const [destinations, categories] = await Promise.all([
    prismaClient.destination.findMany({
      where: { id: { in: uniqueDestinationIds } },
      select: { id: true, name: true },
    }),
    prismaClient.category.findMany({
      where: { id: { in: uniqueCategoryIds } },
      select: { id: true, name: true },
    }),
  ]);

  if (destinations.length !== uniqueDestinationIds.length) {
    return {
      error: "A selected destination no longer exists. Please re-select it.",
    };
  }
  if (categories.length !== uniqueCategoryIds.length) {
    return {
      error: "A selected category no longer exists. Please re-select it.",
    };
  }

  const destinationName = new Map(destinations.map((d) => [d.id, d.name]));
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));

  const legacyCategory = uniqueCategoryIds
    .map((id) => categoryName.get(id) ?? "")
    .map((name) => PACKAGE_CATEGORIES.find((c) => c.toLowerCase() === name.toLowerCase()))
    .find((c): c is PackageCategory => c !== undefined);

  return {
    destination: uniqueDestinationIds
      .map((id) => destinationName.get(id))
      .join(" - "),
    category: legacyCategory ?? null,
    destinationLinks: uniqueDestinationIds.map((destinationId, sortOrder) => ({
      destinationId,
      isPrimary: sortOrder === 0,
      sortOrder,
    })),
    categoryLinks: uniqueCategoryIds.map((categoryId, sortOrder) => ({
      categoryId,
      sortOrder,
    })),
  };
}

export interface ResolvedInclusions {
  /** Legacy text lists the public page still reads, in pick order. */
  inclusions: string[];
  exclusions: string[];
  links: { inclusionId: string; type: "included" | "excluded"; sortOrder: number }[];
}

/**
 * Turns the picked inclusion / exclusion ids (in pick order) into the link
 * rows to store plus the legacy text lists. Returns an error message if an id
 * no longer exists or an item is on both lists.
 */
export async function resolveInclusions(
  inclusionIds: string[],
  exclusionIds: string[],
): Promise<{ error: string } | ResolvedInclusions> {
  const included = [...new Set(inclusionIds)];
  const excluded = [...new Set(exclusionIds)];

  if (excluded.some((id) => included.includes(id))) {
    return { error: "An item can't be both included and excluded." };
  }

  const ids = [...included, ...excluded];
  const rows = await prismaClient.inclusion.findMany({
    where: { id: { in: ids } },
    select: { id: true, text: true },
  });
  if (rows.length !== ids.length) {
    return {
      error: "A selected inclusion or exclusion no longer exists. Please re-select it.",
    };
  }
  const textById = new Map(rows.map((r) => [r.id, r.text]));

  return {
    inclusions: included.map((id) => textById.get(id) ?? ""),
    exclusions: excluded.map((id) => textById.get(id) ?? ""),
    links: [
      ...included.map((inclusionId, sortOrder) => ({
        inclusionId,
        type: "included" as const,
        sortOrder,
      })),
      ...excluded.map((inclusionId, sortOrder) => ({
        inclusionId,
        type: "excluded" as const,
        sortOrder,
      })),
    ],
  };
}

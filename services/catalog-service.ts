import { cache } from "react";
import { prismaClient } from "@/lib/prisma";
import type { Package } from "@/app/generated/prisma/client";

/** A package card plus the label shown on its photo. */
export type CatalogPackage = Package & { badge: string | null };

export interface DestinationLink {
  slug: string;
  name: string;
  /** Active packages that include this destination. */
  count: number;
}

/** A destination as the photo tiles at the top of /packages show it. */
export interface DestinationTile extends DestinationLink {
  /** State (India) or country (abroad), shown under the name. */
  region: string;
  /** Cover photo of its most popular package, if any. */
  image: string | null;
  /** Lowest per-person starting price across its packages. */
  fromPrice: number | null;
}

/** A state (India) or a country (abroad), with the packages that start there. */
export interface RegionGroup {
  key: string;
  label: string;
  /** Domestic regions are listed before international ones. */
  domestic: boolean;
  packages: CatalogPackage[];
}

export interface CategoryLink {
  slug: string;
  name: string;
  count: number;
}

export interface Catalog {
  regions: RegionGroup[];
  /** Destination photo tiles for the top of the page. */
  tiles: { domestic: DestinationTile[]; international: DestinationTile[] };
  categories: CategoryLink[];
  totalPackages: number;
}

export interface DestinationPage {
  slug: string;
  name: string;
  state: string | null;
  country: string;
  packages: CatalogPackage[];
  /** Other destinations in the same state or country, for "keep exploring". */
  nearby: DestinationLink[];
}

export interface CategoryPage {
  slug: string;
  name: string;
  packages: CatalogPackage[];
  /** The other categories, for "keep exploring". */
  others: CategoryLink[];
}

const HOME_COUNTRY = "India";

const cardInclude = {
  destinations: {
    include: {
      destination: {
        select: { id: true, slug: true, name: true, state: true, country: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  },
  categories: {
    include: { category: { select: { slug: true, name: true, sortOrder: true } } },
    orderBy: { sortOrder: "asc" },
  },
} as const;

type Row = Package & {
  destinations: {
    isPrimary: boolean;
    sortOrder: number;
    destination: {
      id: string;
      slug: string;
      name: string;
      state: string | null;
      country: string;
    };
  }[];
  categories: {
    category: { slug: string; name: string; sortOrder: number };
  }[];
};

const byPopularity = (a: Package, b: Package) =>
  b.popularityScore - a.popularityScore || a.name.localeCompare(b.name);

function toCard(row: Row): CatalogPackage {
  const { destinations: _d, categories, ...pkg } = row;
  void _d;
  return { ...pkg, badge: categories[0]?.category.name ?? null };
}

/** The destination a package is filed under on the landing page. */
function primaryOf(row: Row) {
  const links = row.destinations;
  return (links.find((l) => l.isPrimary) ?? links[0])?.destination ?? null;
}

function regionOf(destination: {
  state: string | null;
  country: string;
  name: string;
}) {
  const domestic = destination.country === HOME_COUNTRY;
  // A destination with no state set is its own heading rather than being lost.
  const label = domestic ? destination.state?.trim() || destination.name : destination.country;
  return { key: `${domestic ? "in" : "world"}:${label}`, label, domestic };
}

async function loadActive(): Promise<Row[]> {
  return prismaClient.package.findMany({
    where: { status: "active" },
    include: cardInclude,
    relationLoadStrategy: "join",
  }) as unknown as Promise<Row[]>;
}

type TileDraft = DestinationTile & { domestic: boolean; photos: string[] };

/**
 * Orders the destination tiles (most packages first) and gives each one a
 * photo no earlier tile is using, so two places covered by the same package
 * don't show the same picture.
 */
function buildTiles(
  drafts: TileDraft[],
  chosen: Map<string, string>,
): Catalog["tiles"] {
  const used = new Set<string>(chosen.values());
  const sorted = [...drafts].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
  const tiles = sorted.map(({ photos, domestic, ...tile }) => {
    const image =
      chosen.get(tile.slug) ??
      photos.find((p) => !used.has(p)) ??
      photos[0] ??
      null;
    if (image) used.add(image);
    return { domestic, tile: { ...tile, image } };
  });
  return {
    domestic: tiles.filter((t) => t.domestic).map((t) => t.tile),
    international: tiles.filter((t) => !t.domestic).map((t) => t.tile),
  };
}

/**
 * Tile photos chosen in the Gallery: an image tagged with a destination's
 * slug or name (e.g. "manali", "port blair") becomes that destination's tile.
 */
async function loadChosenTilePhotos(rows: Row[]): Promise<Map<string, string>> {
  const bySlug = new Map<string, string>(); // tag -> destination slug
  for (const row of rows) {
    for (const { destination } of row.destinations) {
      bySlug.set(destination.slug, destination.slug);
      bySlug.set(destination.name.toLowerCase(), destination.slug);
    }
  }
  if (bySlug.size === 0) return new Map();

  const images = await prismaClient.mediaImage.findMany({
    where: { tags: { hasSome: [...bySlug.keys()] } },
    select: { url: true, tags: true },
    orderBy: { createdAt: "desc" }, // newest tagged photo wins
  });
  const chosen = new Map<string, string>();
  for (const image of images) {
    for (const tag of image.tags) {
      const slug = bySlug.get(tag);
      if (slug && !chosen.has(slug)) chosen.set(slug, image.url);
    }
  }
  return chosen;
}

function buildCatalog(rows: Row[], chosen: Map<string, string>): Catalog {
  const regions = new Map<string, RegionGroup>();
  const destinationCounts = new Map<string, TileDraft>();
  const categoryCounts = new Map<string, CategoryLink & { sortOrder: number }>();

  for (const row of [...rows].sort(byPopularity)) {
    const primary = primaryOf(row);
    const region = primary
      ? regionOf(primary)
      : { key: "other", label: "More packages", domestic: false };
    let group = regions.get(region.key);
    if (!group) {
      group = { ...region, packages: [] };
      regions.set(region.key, group);
    }
    group.packages.push(toCard(row));

    // A package counts for every destination it covers. Rows come most
    // popular first, so photos are collected best-known package first.
    const price = row.startingPrice || row.pricePerPerson;
    for (const { destination } of row.destinations) {
      const existing = destinationCounts.get(destination.slug);
      if (existing) {
        existing.count++;
        existing.photos.push(...row.images);
        if (price > 0 && (existing.fromPrice === null || price < existing.fromPrice)) {
          existing.fromPrice = price;
        }
      } else {
        const where = regionOf(destination);
        destinationCounts.set(destination.slug, {
          slug: destination.slug,
          name: destination.name,
          count: 1,
          region: where.label,
          image: null,
          fromPrice: price > 0 ? price : null,
          domestic: where.domestic,
          photos: [...row.images],
        });
      }
    }

    for (const { category } of row.categories) {
      const existing = categoryCounts.get(category.slug);
      if (existing) existing.count++;
      else categoryCounts.set(category.slug, { ...category, count: 1 });
    }
  }

  const ordered = [...regions.values()].sort(
    (a, b) =>
      Number(b.domestic) - Number(a.domestic) ||
      (a.key === "other" ? 1 : 0) - (b.key === "other" ? 1 : 0) ||
      a.label.localeCompare(b.label),
  );

  return {
    regions: ordered,
    tiles: buildTiles([...destinationCounts.values()], chosen),
    categories: [...categoryCounts.values()]
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
      .map(({ slug, name, count }) => ({ slug, name, count })),
    totalPackages: rows.length,
  };
}

export class CatalogService {
  /** Everything for the /packages landing page. */
  static getCatalog = cache(async (): Promise<Catalog> => {
    const rows = await loadActive();
    return buildCatalog(rows, await loadChosenTilePhotos(rows));
  });

  /** Destinations that have at least one live package (for static pages + sitemap). */
  static async getDestinationSlugs(): Promise<string[]> {
    const rows = await prismaClient.destination.findMany({
      where: { packages: { some: { package: { status: "active" } } } },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  }

  static async getCategorySlugs(): Promise<string[]> {
    const rows = await prismaClient.category.findMany({
      where: { packages: { some: { package: { status: "active" } } } },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  }

  /** null when the destination doesn't exist or has no live package. */
  static getDestinationPage = cache(
    async (slug: string): Promise<DestinationPage | null> => {
      const destination = await prismaClient.destination.findUnique({
        where: { slug },
        select: { id: true, slug: true, name: true, state: true, country: true },
      });
      if (!destination) return null;

      const rows = (await prismaClient.package.findMany({
        where: {
          status: "active",
          destinations: { some: { destinationId: destination.id } },
        },
        include: cardInclude,
        relationLoadStrategy: "join",
      })) as unknown as Row[];
      if (rows.length === 0) return null;

      const sameRegion = await prismaClient.destination.findMany({
        where: {
          id: { not: destination.id },
          country: destination.country,
          ...(destination.state ? { state: destination.state } : {}),
          packages: { some: { package: { status: "active" } } },
        },
        select: {
          slug: true,
          name: true,
          _count: { select: { packages: { where: { package: { status: "active" } } } } },
        },
        orderBy: { name: "asc" },
        take: 12,
      });

      return {
        ...destination,
        packages: rows.sort(byPopularity).map(toCard),
        nearby: sameRegion.map((d) => ({
          slug: d.slug,
          name: d.name,
          count: d._count.packages,
        })),
      };
    },
  );

  /** null when the category doesn't exist or has no live package. */
  static getCategoryPage = cache(
    async (slug: string): Promise<CategoryPage | null> => {
      const category = await prismaClient.category.findUnique({
        where: { slug },
        select: { id: true, slug: true, name: true },
      });
      if (!category) return null;

      const rows = (await prismaClient.package.findMany({
        where: {
          status: "active",
          categories: { some: { categoryId: category.id } },
        },
        include: cardInclude,
        relationLoadStrategy: "join",
      })) as unknown as Row[];
      if (rows.length === 0) return null;

      const others = (await CatalogService.getCatalog()).categories.filter(
        (c) => c.slug !== category.slug,
      );
      return {
        slug: category.slug,
        name: category.name,
        packages: rows.sort(byPopularity).map(toCard),
        others,
      };
    },
  );
}

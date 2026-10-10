import { prismaClient } from "@/lib/prisma";
import type { Package } from "@/app/generated/prisma/client";

/** How many to show when the admin hasn't picked any. */
const FALLBACK_COUNT = 6;

export const TRENDING_DEFAULTS = {
  title: "Trending Now",
  subtitle: "Top picks for your next holiday",
} as const;

export type TrendingPackageCard = Package & { badge: string | null };

export interface TrendingSection {
  title: string;
  subtitle: string;
  packages: TrendingPackageCard[];
}

/** A package as the admin picker lists it. */
export interface TrendingChoice {
  id: string;
  name: string;
  slug: string;
  destination: string;
  startingPrice: number;
  image: string | null;
  /** Anything but "active" is hidden from the public block. */
  status: string;
}

export interface TrendingAdminState {
  title: string;
  subtitle: string;
  /** Chosen packages, in display order. */
  selected: TrendingChoice[];
  /** Every live package, for the "add" list. */
  available: TrendingChoice[];
  /** What the site shows right now when nothing is chosen. */
  usingFallback: boolean;
}

const cardInclude = {
  categories: {
    include: { category: { select: { name: true } } },
    orderBy: { sortOrder: "asc" },
    take: 1,
  },
} as const;

function toChoice(
  pkg: Pick<Package, "id" | "name" | "slug" | "destination" | "startingPrice" | "pricePerPerson" | "images" | "status">,
): TrendingChoice {
  return {
    id: pkg.id,
    name: pkg.name,
    slug: pkg.slug,
    destination: pkg.destination,
    startingPrice: pkg.startingPrice || pkg.pricePerPerson,
    image: pkg.images[0] ?? null,
    status: pkg.status,
  };
}

export class TrendingService {
  /** The home page block: heading and the live packages, in the admin's order. */
  static async getSection(): Promise<TrendingSection> {
    const [settings, chosen] = await Promise.all([
      prismaClient.siteSettings.findFirst({
        where: { id: 1 },
        select: { trendingTitle: true, trendingSubtitle: true },
      }),
      prismaClient.trendingPackage.findMany({
        where: { package: { status: "active" } },
        include: { package: { include: cardInclude } },
        orderBy: { sortOrder: "asc" },
        relationLoadStrategy: "join",
      }),
    ]);

    let rows = chosen.map((c) => c.package);
    if (rows.length === 0) {
      // Nothing picked (or none of it is live): never leave the home page bare.
      rows = await prismaClient.package.findMany({
        where: { status: "active" },
        include: cardInclude,
        orderBy: [{ popularityScore: "desc" }, { name: "asc" }],
        take: FALLBACK_COUNT,
        relationLoadStrategy: "join",
      });
    }

    return {
      title: settings?.trendingTitle.trim() || TRENDING_DEFAULTS.title,
      subtitle: settings?.trendingSubtitle.trim() ?? TRENDING_DEFAULTS.subtitle,
      packages: rows.map(({ categories, ...pkg }) => ({
        ...pkg,
        badge: categories[0]?.category.name ?? null,
      })),
    };
  }

  static async getAdminState(): Promise<TrendingAdminState> {
    const [settings, chosen, live] = await Promise.all([
      prismaClient.siteSettings.findFirst({
        where: { id: 1 },
        select: { trendingTitle: true, trendingSubtitle: true },
      }),
      prismaClient.trendingPackage.findMany({
        include: { package: true },
        orderBy: { sortOrder: "asc" },
      }),
      prismaClient.package.findMany({
        where: { status: "active" },
        orderBy: { name: "asc" },
      }),
    ]);

    return {
      title: settings?.trendingTitle ?? TRENDING_DEFAULTS.title,
      subtitle: settings?.trendingSubtitle ?? TRENDING_DEFAULTS.subtitle,
      selected: chosen.map((c) => toChoice(c.package)),
      available: live.map(toChoice),
      usingFallback: !chosen.some((c) => c.package.status === "active"),
    };
  }
}

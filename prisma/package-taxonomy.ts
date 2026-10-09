import type { PrismaClient } from "../app/generated/prisma/client";

const CATEGORY_ORDER = [
  "Beach",
  "Hill",
  "Heritage",
  "Pilgrimage",
  "International",
  "Honeymoon",
  "Family",
];

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "Jaipur - Jodhpur - Udaipur" -> ["Jaipur", "Jodhpur", "Udaipur"] */
export function splitDestinations(destination: string): string[] {
  const seen = new Set<string>();
  return destination
    .split(/\s+-\s+|\s*,\s*/)
    .map((part) => part.trim())
    .filter((part) => {
      if (!part) return false;
      const key = part.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

// Countries for the international places in the existing package data.
// Anything not listed here is treated as India.
const COUNTRY_BY_DESTINATION: Record<string, string> = {
  dubai: "United Arab Emirates",
  bali: "Indonesia",
  singapore: "Singapore",
  maldives: "Maldives",
  bangkok: "Thailand",
  pattaya: "Thailand",
};

type PackageLike = {
  destination: string;
  category: string;
};

/**
 * Ensures Destination / Category rows exist for a package's legacy
 * `destination` string and `category` enum. Does not link them to the
 * package (that comes once Package is changed). Idempotent.
 */
export async function syncPackageTaxonomy(
  prisma: PrismaClient,
  pkg: PackageLike,
) {
  for (const name of splitDestinations(pkg.destination)) {
    await prisma.destination.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: {
        slug: slugify(name),
        name,
        country: COUNTRY_BY_DESTINATION[name.toLowerCase()] ?? "India",
      },
    });
  }

  await prisma.category.upsert({
    where: { slug: slugify(pkg.category) },
    update: {},
    create: {
      slug: slugify(pkg.category),
      name: pkg.category,
      sortOrder: Math.max(CATEGORY_ORDER.indexOf(pkg.category), 0),
    },
  });
}

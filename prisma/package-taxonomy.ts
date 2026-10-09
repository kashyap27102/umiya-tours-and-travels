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
  category: string | null;
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

  if (!pkg.category) return;

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

/**
 * Links a package to the Destination / Category rows matching its legacy
 * `destination` string and `category` enum (rows must already exist, see
 * syncPackageTaxonomy). Skips whatever the package is already linked to.
 * Returns the names it could not find.
 */
export async function linkPackageTaxonomy(
  prisma: PrismaClient,
  pkg: { id: string; destination: string; category: string | null },
): Promise<string[]> {
  const missing: string[] = [];

  const existing = await prisma.package.findUniqueOrThrow({
    where: { id: pkg.id },
    select: { _count: { select: { destinations: true, categories: true } } },
  });

  if (existing._count.destinations === 0) {
    for (const [index, name] of splitDestinations(pkg.destination).entries()) {
      const destination = await prisma.destination.findUnique({
        where: { slug: slugify(name) },
      });
      if (!destination) {
        missing.push(`destination "${name}"`);
        continue;
      }
      await prisma.packageDestination.create({
        data: {
          packageId: pkg.id,
          destinationId: destination.id,
          isPrimary: index === 0,
          sortOrder: index,
        },
      });
    }
  }

  if (existing._count.categories === 0 && pkg.category) {
    const category = await prisma.category.findUnique({
      where: { slug: slugify(pkg.category) },
    });
    if (!category) {
      missing.push(`category "${pkg.category}"`);
    } else {
      await prisma.packageCategoryLink.create({
        data: { packageId: pkg.id, categoryId: category.id, sortOrder: 0 },
      });
    }
  }

  return missing;
}

/**
 * Turns a package's legacy `inclusions` / `exclusions` text lists into shared
 * Inclusion rows (matched by text, ignoring case) and links them to the
 * package. Skips packages that already have links. Idempotent.
 */
export async function linkPackageInclusions(
  prisma: PrismaClient,
  pkg: { id: string; inclusions: string[]; exclusions: string[] },
): Promise<void> {
  const existing = await prisma.packageInclusion.count({
    where: { packageId: pkg.id },
  });
  if (existing > 0) return;

  const used = new Set<string>();
  const entries: { text: string; type: "included" | "excluded" }[] = [
    ...pkg.inclusions.map((text) => ({ text, type: "included" as const })),
    ...pkg.exclusions.map((text) => ({ text, type: "excluded" as const })),
  ];

  let included = 0;
  let excluded = 0;
  for (const entry of entries) {
    const text = entry.text.trim();
    // An item can be on one side only, and only once per package.
    if (!text || used.has(text.toLowerCase())) continue;
    used.add(text.toLowerCase());

    const inclusion =
      (await prisma.inclusion.findFirst({
        where: { text: { equals: text, mode: "insensitive" } },
      })) ?? (await prisma.inclusion.create({ data: { text } }));

    await prisma.packageInclusion.create({
      data: {
        packageId: pkg.id,
        inclusionId: inclusion.id,
        type: entry.type,
        sortOrder: entry.type === "included" ? included++ : excluded++,
      },
    });
  }
}

/**
 * Registers a package's legacy image URLs in the shared library (one row per
 * distinct URL, reused if it already exists) and links them to the package in
 * order. Skips packages that already have image links. Idempotent.
 */
export async function linkPackageImages(
  prisma: PrismaClient,
  pkg: { id: string; name: string; images: string[] },
): Promise<void> {
  const existing = await prisma.packageImage.count({
    where: { packageId: pkg.id },
  });
  if (existing > 0) return;

  const urls = [...new Set(pkg.images.map((u) => u.trim()).filter(Boolean))];
  for (const [sortOrder, url] of urls.entries()) {
    const image = await prisma.mediaImage.upsert({
      where: { url },
      update: {},
      create: {
        url,
        title: urls.length > 1 ? `${pkg.name} ${sortOrder + 1}` : pkg.name,
        alt: pkg.name,
        source: "legacy_link",
      },
    });
    await prisma.packageImage.create({
      data: { packageId: pkg.id, imageId: image.id, sortOrder },
    });
  }
}

// Puts every package's existing image URLs into the shared image library and
// links them to the package in order. Itinerary-day photos are linked too.
// Safe to re-run: packages that already have image links are skipped.
// Usage: npx tsx prisma/backfill-media.ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { linkPackageImages } from "./package-taxonomy";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const packages = await prisma.package.findMany({
    select: { id: true, name: true, images: true },
  });
  for (const pkg of packages) {
    await linkPackageImages(prisma, pkg);
  }

  // Itinerary photos that have a URL but no library link yet.
  const days = await prisma.itineraryItem.findMany({
    where: { imageId: null, imageUrl: { not: null } },
    select: { id: true, imageUrl: true, title: true },
  });
  for (const day of days) {
    const url = day.imageUrl as string;
    const image = await prisma.mediaImage.upsert({
      where: { url },
      update: {},
      create: { url, title: day.title, alt: day.title, source: "legacy_link" },
    });
    await prisma.itineraryItem.update({
      where: { id: day.id },
      data: { imageId: image.id },
    });
  }

  const [images, links] = await Promise.all([
    prisma.mediaImage.count(),
    prisma.packageImage.count(),
  ]);
  console.log(
    `Done: ${packages.length} packages checked, ${images} library images, ${links} package links, ${days.length} itinerary photos linked`,
  );
}

main()
  .catch((e) => {
    console.error("Backfill failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

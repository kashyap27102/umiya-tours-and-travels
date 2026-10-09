// Fills the Destination / Category tables from the legacy
// Package.destination string and Package.category enum (no package links yet).
// Safe to re-run. Usage: npx tsx prisma/backfill-taxonomy.ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { syncPackageTaxonomy } from "./package-taxonomy";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const packages = await prisma.package.findMany({
    select: { name: true, destination: true, category: true },
  });

  for (const pkg of packages) {
    await syncPackageTaxonomy(prisma, pkg);
    console.log(`  ${pkg.name}: ${pkg.destination} [${pkg.category}]`);
  }

  const [destinations, categories] = await Promise.all([
    prisma.destination.count(),
    prisma.category.count(),
  ]);
  console.log(
    `Done: ${packages.length} packages, ${destinations} destinations, ${categories} categories`,
  );
}

main()
  .catch((e) => {
    console.error("Backfill failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

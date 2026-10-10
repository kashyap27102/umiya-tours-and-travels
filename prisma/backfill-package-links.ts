// Links every package to Destination / Category rows using its legacy
// Package.destination string and Package.category enum. Safe to re-run:
// packages that already have links are left alone.
// Run backfill-taxonomy.ts first so the rows exist.
// Usage: npx tsx prisma/backfill-package-links.ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { linkPackageTaxonomy } from "./package-taxonomy";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const packages = await prisma.package.findMany({
    select: { id: true, name: true, destination: true, category: true },
  });

  const problems: string[] = [];
  for (const pkg of packages) {
    const missing = await linkPackageTaxonomy(prisma, pkg);
    missing.forEach((m) => problems.push(`${pkg.name}: ${m}`));
  }

  const [d, c] = await Promise.all([
    prisma.packageDestination.count(),
    prisma.packageCategoryLink.count(),
  ]);
  console.log(
    `Done: ${packages.length} packages checked, ${d} destination links, ${c} category links`,
  );
  if (problems.length) {
    console.log("Could not link (run backfill-taxonomy first?):");
    problems.forEach((p) => console.log("  -", p));
  }
}

main()
  .catch((e) => {
    console.error("Backfill failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

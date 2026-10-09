// Builds the shared Inclusion list from every package's legacy inclusions /
// exclusions text lists and links each package to its items. Safe to re-run:
// packages that already have links are skipped.
// Usage: npx tsx prisma/backfill-inclusions.ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { linkPackageInclusions } from "./package-taxonomy";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const packages = await prisma.package.findMany({
    select: { id: true, inclusions: true, exclusions: true },
  });

  for (const pkg of packages) {
    await linkPackageInclusions(prisma, pkg);
  }

  const [items, links] = await Promise.all([
    prisma.inclusion.count(),
    prisma.packageInclusion.count(),
  ]);
  console.log(
    `Done: ${packages.length} packages checked, ${items} shared items, ${links} package links`,
  );
}

main()
  .catch((e) => {
    console.error("Backfill failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

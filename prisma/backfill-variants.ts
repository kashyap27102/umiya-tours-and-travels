// Gives every package without variants a flat-priced "Standard" variant built
// from the legacy Package.pricePerPerson, and sets Package.startingPrice.
// No stays are created (hotel details are unknown). Safe to re-run.
// Usage: npx tsx prisma/backfill-variants.ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const packages = await prisma.package.findMany({
    select: {
      id: true,
      name: true,
      pricePerPerson: true,
      _count: { select: { variants: true } },
    },
  });

  let created = 0;
  for (const pkg of packages) {
    if (pkg._count.variants === 0) {
      await prisma.packageVariant.create({
        data: {
          packageId: pkg.id,
          name: "Standard",
          pricingMode: "flat",
          flatPrice: pkg.pricePerPerson,
        },
      });
      created++;
    }
    await prisma.package.update({
      where: { id: pkg.id },
      data: { startingPrice: pkg.pricePerPerson },
    });
    console.log(`  ${pkg.name}: from ₹${pkg.pricePerPerson}`);
  }

  console.log(
    `Done: ${packages.length} packages, ${created} Standard variants created`,
  );
}

main()
  .catch((e) => {
    console.error("Backfill failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

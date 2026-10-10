// Gives every itinerary day without bullet points one point built from its
// legacy description paragraph. Safe to re-run: days that already have points
// are left alone.
// Usage: npx tsx prisma/backfill-itinerary-points.ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const days = await prisma.itineraryItem.findMany({
    where: { points: { isEmpty: true } },
    select: { id: true, description: true },
  });

  let updated = 0;
  for (const day of days) {
    const text = day.description.trim();
    if (!text) continue;
    await prisma.itineraryItem.update({
      where: { id: day.id },
      data: { points: [text] },
    });
    updated++;
  }

  const total = await prisma.itineraryItem.count();
  console.log(`Done: ${updated} days given points (${total} days in total)`);
}

main()
  .catch((e) => {
    console.error("Backfill failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

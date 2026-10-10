// Copies the testimonials that used to live as JSON on SiteSettings into the
// Testimonial table, keeping their order. Safe to re-run: a review with the
// same name and text is skipped.
// Usage: npx tsx prisma/backfill-testimonials.ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface LegacyTestimonial {
  name?: string;
  location?: string;
  rating?: number;
  review?: string;
}

async function main() {
  const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } });
  const legacy = Array.isArray(settings?.testimonials)
    ? (settings.testimonials as unknown as LegacyTestimonial[])
    : [];

  let created = 0;
  for (const [index, item] of legacy.entries()) {
    const name = item.name?.trim();
    const review = item.review?.trim();
    if (!name || !review) continue;

    const exists = await prisma.testimonial.findFirst({
      where: { name, review },
      select: { id: true },
    });
    if (exists) continue;

    await prisma.testimonial.create({
      data: {
        name,
        review,
        location: item.location?.trim() || "—",
        rating: Math.min(5, Math.max(1, Math.round(item.rating ?? 5))),
        sortOrder: index,
      },
    });
    created++;
  }

  const total = await prisma.testimonial.count();
  console.log(
    `Legacy testimonials found: ${legacy.length}, copied now: ${created}, table total: ${total}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// Fills in the state of Indian destinations that have none, so the public
// package page can group by state. Only touches destinations whose state is
// empty, so anything edited in the admin is left alone. Safe to re-run.
// Usage: npx tsx prisma/backfill-destination-states.ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const STATE_BY_SLUG: Record<string, string> = {
  gujarat: "Gujarat",
  uttarakhand: "Uttarakhand",
  manali: "Himachal Pradesh",
  shimla: "Himachal Pradesh",
  jaipur: "Rajasthan",
  jodhpur: "Rajasthan",
  udaipur: "Rajasthan",
  tirupati: "Andhra Pradesh",
  munnar: "Kerala",
  thekkady: "Kerala",
  alleppey: "Kerala",
  ooty: "Tamil Nadu",
  coonoor: "Tamil Nadu",
  goa: "Goa",
  varanasi: "Uttar Pradesh",
  agra: "Uttar Pradesh",
  "port-blair": "Andaman and Nicobar Islands",
  havelock: "Andaman and Nicobar Islands",
  shirdi: "Maharashtra",
  nashik: "Maharashtra",
  mumbai: "Maharashtra",
  lonavala: "Maharashtra",
  srinagar: "Jammu and Kashmir",
  gulmarg: "Jammu and Kashmir",
  pahalgam: "Jammu and Kashmir",
};

async function main() {
  const destinations = await prisma.destination.findMany({
    where: { country: "India", OR: [{ state: null }, { state: "" }] },
    select: { id: true, slug: true, name: true },
  });

  let updated = 0;
  const unknown: string[] = [];
  for (const d of destinations) {
    const state = STATE_BY_SLUG[d.slug];
    if (!state) {
      unknown.push(d.name);
      continue;
    }
    await prisma.destination.update({ where: { id: d.id }, data: { state } });
    updated++;
  }
  console.log(`Updated ${updated} destination(s).`);
  if (unknown.length) console.log("No state known for:", unknown.join(", "));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

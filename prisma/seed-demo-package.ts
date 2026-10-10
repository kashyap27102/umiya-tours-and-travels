// Creates (or re-creates) one fully filled-in demo package so the public
// package page and the admin forms can be tried out, and removes it again.
//
//   npx tsx prisma/seed-demo-package.ts            create / re-create it
//   npx tsx prisma/seed-demo-package.ts --remove   delete it and its demo hotels
//
// It is a normal active package ("Himachal Delight (Demo)") with three stay
// levels, group-size pricing, hotels, bullet-point itinerary with photos,
// shared inclusions/exclusions and images from the gallery.
import "dotenv/config";
import { prismaClient as prisma } from "../lib/prisma";
import { toItineraryRow } from "../lib/itinerary";
import {
  resolveInclusions,
  resolveMedia,
  resolvePackageLinks,
} from "../services/package-links-service";
import {
  startingPriceOf,
  toVariantCreateInput,
} from "../services/package-variant-service";
import type { VariantFormValues } from "../schemas/package";

const SLUG = "himachal-delight-demo-5n-6d";

const HOTELS = {
  shimla: [
    { name: "Hotel Snow Valley", starRating: 3, address: "The Mall, Shimla" },
    { name: "The Cedar Retreat", starRating: 4, address: "Chhota Shimla" },
    { name: "Himalayan Crown Palace", starRating: 5, address: "Summer Hill, Shimla" },
  ],
  manali: [
    { name: "Hotel Pine View", starRating: 3, address: "Old Manali Road" },
    { name: "Span Valley Resort", starRating: 4, address: "Kullu-Manali Highway" },
    { name: "The Snow Peak Residency", starRating: 5, address: "Mall Road, Manali" },
  ],
};
const HOTEL_NAMES = [...HOTELS.shimla, ...HOTELS.manali].map((h) => h.name);

const INCLUDED = [
  "Hotel accommodation",
  "Daily breakfast",
  "Sightseeing as per itinerary",
  "Private or shared transfers",
  "Trip assistance",
];
const EXCLUDED = [
  "Flight or train tickets",
  "Personal expenses",
  "Lunch and dinner unless mentioned",
  "Entry tickets not listed",
  "Travel insurance",
];

async function remove() {
  await prisma.package.deleteMany({ where: { slug: SLUG } });
  // Hotels can only go once nothing uses them.
  const removed = await prisma.hotel.deleteMany({
    where: { name: { in: HOTEL_NAMES }, stays: { none: {} } },
  });
  console.log(`Removed the demo package and ${removed.count} demo hotels.`);
}

async function create() {
  await remove();

  const need = <T>(value: T | null | undefined, what: string): T => {
    if (value == null) throw new Error(`Missing ${what}. Run the earlier backfills first.`);
    return value;
  };

  const shimla = need(await prisma.destination.findUnique({ where: { slug: "shimla" } }), "destination Shimla");
  const manali = need(await prisma.destination.findUnique({ where: { slug: "manali" } }), "destination Manali");
  const hill = need(await prisma.category.findUnique({ where: { slug: "hill" } }), "category Hill");
  const family = need(await prisma.category.findUnique({ where: { slug: "family" } }), "category Family");

  // Hotels
  const hotel = new Map<string, string>();
  for (const [dest, list] of [[shimla, HOTELS.shimla], [manali, HOTELS.manali]] as const) {
    for (const h of list) {
      const row = await prisma.hotel.upsert({
        where: { destinationId_name: { destinationId: dest.id, name: h.name } },
        update: {},
        create: { destinationId: dest.id, ...h },
      });
      hotel.set(h.name, row.id);
    }
  }

  // Gallery images (re-used from existing packages)
  const gallery = async (title: string) =>
    need(await prisma.mediaImage.findFirst({ where: { title: { startsWith: title } } }), `gallery image "${title}"`);
  // Hill-scenery photos that are known to load (a few of the original seed
  // photos, e.g. "Manali Snow Trail", are dead links).
  const [imgShimla, imgOoty, imgMunnar] = await Promise.all([
    gallery("Shimla Kufri Leisure"),
    gallery("Ooty Coonoor"),
    gallery("Munnar Thekkady"),
  ]);
  const ref = (m: { id: string; url: string; title: string; alt: string }) => ({
    id: m.id,
    url: m.url,
    title: m.title,
    alt: m.alt || `${m.title} - Himachal`,
  });

  // Shared inclusions / exclusions
  const texts = await prisma.inclusion.findMany({
    where: { text: { in: [...INCLUDED, ...EXCLUDED] } },
    select: { id: true, text: true },
  });
  const idOf = (t: string) => need(texts.find((x) => x.text === t)?.id, `inclusion "${t}"`);

  // Stay levels
  const stays = (a: string, b: string, room: string, roomB = room) => [
    { destinationId: shimla.id, hotelId: need(hotel.get(a), a), nights: 2, roomType: room },
    { destinationId: manali.id, hotelId: need(hotel.get(b), b), nights: 3, roomType: roomB },
  ];
  const variants: VariantFormValues[] = [
    {
      name: "Economy",
      pricingMode: "flat",
      flatPrice: 11999,
      prices: [],
      stays: stays("Hotel Snow Valley", "Hotel Pine View", "Standard Room"),
    },
    {
      name: "Deluxe",
      pricingMode: "group_size",
      flatPrice: null,
      prices: [
        { persons: 2, pricePerPerson: 17999 },
        { persons: 4, pricePerPerson: 14999 },
        { persons: 6, pricePerPerson: 13499 },
      ],
      stays: stays("The Cedar Retreat", "Span Valley Resort", "Deluxe Room", "Valley View Room"),
    },
    {
      name: "Premium",
      pricingMode: "group_size",
      flatPrice: null,
      prices: [
        { persons: 2, pricePerPerson: 26999 },
        { persons: 4, pricePerPerson: 22999 },
        { persons: 6, pricePerPerson: 20999 },
      ],
      stays: stays("Himalayan Crown Palace", "The Snow Peak Residency", "Premium Suite", "Mountain View Suite"),
    },
  ];

  const links = await resolvePackageLinks([shimla.id, manali.id], [hill.id, family.id]);
  if ("error" in links) throw new Error(links.error);
  const inclusion = await resolveInclusions(INCLUDED.map(idOf), EXCLUDED.map(idOf));
  if ("error" in inclusion) throw new Error(inclusion.error);

  const packageImages = [imgShimla, imgOoty, imgMunnar].map(ref);
  const media = await resolveMedia(packageImages.map((i) => i.id));
  if ("error" in media) throw new Error(media.error);

  const day = (
    n: number,
    title: string,
    points: string[],
    image: ReturnType<typeof ref> | null = null,
  ) => toItineraryRow({ day: n, title, points, image });
  const itinerary = [
    day(1, "Arrival in Shimla", [
      "Pickup from Chandigarh airport or railway station",
      "Scenic 4-hour drive up to Shimla",
      "Hotel check-in and freshen up",
      "Evening stroll on Mall Road and dinner",
    ], ref(imgShimla)),
    day(2, "Shimla sightseeing and Kufri", [
      "Breakfast, then an excursion to Kufri",
      "Visit Jakhoo Temple and the Ridge",
      "Photo stop at Christ Church",
      "Free evening for shopping on Lakkar Bazaar",
    ]),
    day(3, "Shimla to Manali", [
      "Early breakfast and check-out",
      "Drive along the Beas river through the Kullu valley",
      "Stop at Pandoh Dam for photos",
      "Check in to your Manali hotel by evening",
    ], ref(imgOoty)),
    day(4, "Manali local sightseeing", [
      "Hadimba Devi Temple and the cedar forest",
      "Vashisht hot springs and village",
      "Evening walk through Old Manali's cafes",
    ]),
    day(5, "Solang Valley and Atal Tunnel", [
      "Drive to Solang Valley for adventure activities",
      "Ropeway, snow scooter and paragliding (seasonal, own cost)",
      "Return through the Atal Tunnel",
      "Farewell dinner at the hotel",
    ], ref(imgShimla)),
    day(6, "Departure", [
      "Breakfast and hotel check-out",
      "Transfer to Chandigarh for your onward journey",
    ]),
  ];

  const startingPrice = startingPriceOf(variants);
  const created = await prisma.package.create({
    data: {
      slug: SLUG,
      name: "Himachal Delight (Demo)",
      destination: links.destination,
      category: links.category,
      status: "active",
      durationDays: 6,
      durationNights: 5,
      pricePerPerson: startingPrice,
      startingPrice,
      popularityScore: 90,
      summary:
        "Six relaxed days across Shimla and Manali: colonial hill-station charm, the Kullu valley drive, temples, hot springs and a day in Solang Valley. Choose Economy, Deluxe or Premium stays.",
      highlights: [
        "Mall Road and Kufri in Shimla",
        "Scenic Kullu valley drive along the Beas",
        "Hadimba Temple and Vashisht hot springs",
        "Solang Valley and the Atal Tunnel",
      ],
      images: packageImages.map((i) => media.urlById.get(i.id) ?? i.url),
      imageLinks: {
        create: packageImages.map((img, sortOrder) => ({ imageId: img.id, sortOrder })),
      },
      destinations: { create: links.destinationLinks },
      categories: { create: links.categoryLinks },
      inclusions: inclusion.inclusions,
      exclusions: inclusion.exclusions,
      inclusionLinks: { create: inclusion.links },
      variants: { create: toVariantCreateInput(variants) },
      itinerary: { create: itinerary },
    },
  });

  console.log(`Created "${created.name}" (from Rs ${startingPrice}).`);
  console.log(`  Public page : /packages/${SLUG}`);
  console.log(`  Admin edit  : /admin/package-management/${SLUG}/edit`);
}

(process.argv.includes("--remove") ? remove() : create())
  .catch((e) => {
    console.error("Failed:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

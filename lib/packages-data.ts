import {
  PACKAGE_CATEGORIES,
  type PackageCategory,
  type PackageStatus,
} from "@/lib/packages-constants";

type PackageItineraryItem = {
  day: number;
  title: string;
  description: string;
};

export type TravelPackage = {
  slug: string;
  name: string;
  destination: string;
  category: PackageCategory;
  status: PackageStatus;
  durationDays: number;
  durationLabel: string;
  pricePerPerson: number;
  popularityScore: number;
  image: string;
  summary: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: PackageItineraryItem[];
};

type PackageSeed = Omit<
  TravelPackage,
  "inclusions" | "exclusions" | "itinerary" | "durationLabel" | "status"
> & {
  durationNights: number;
};

const defaultInclusions = [
  "Hotel accommodation",
  "Daily breakfast",
  "Sightseeing as per itinerary",
  "Private or shared transfers",
  "Trip assistance",
];

const defaultExclusions = [
  "Flight or train tickets",
  "Personal expenses",
  "Lunch and dinner unless mentioned",
  "Entry tickets not listed",
  "Travel insurance",
];

const buildItinerary = (
  destination: string,
  days: number,
  highlights: string[],
): PackageItineraryItem[] => {
  return Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    const feature =
      highlights[index % highlights.length] ?? "Local exploration";

    if (day === 1) {
      return {
        day,
        title: `Arrival in ${destination}`,
        description:
          "Check in, freshen up, and enjoy a relaxed evening with a short orientation and local walk.",
      };
    }

    if (day === days) {
      return {
        day,
        title: "Departure",
        description:
          "After breakfast, check out and transfer for your onward journey with memorable travel moments.",
      };
    }

    return {
      day,
      title: `${feature}`,
      description:
        "Enjoy planned activities with adequate leisure time, guided support, and comfortable transport.",
    };
  });
};

const packageSeeds: PackageSeed[] = [
  {
    slug: "goa-beach-escape-4n-5d",
    name: "Goa Beach Escape",
    destination: "Goa",
    category: "Beach",
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 12999,
    popularityScore: 95,
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Sunset beaches, water sports, heritage churches, and vibrant local markets.",
    highlights: [
      "North Goa Beaches",
      "Dudhsagar Excursion",
      "Old Goa Churches",
    ],
  },
  {
    slug: "manali-snow-trail-5n-6d",
    name: "Manali Snow Trail",
    destination: "Manali",
    category: "Hill",
    durationDays: 6,
    durationNights: 5,
    pricePerPerson: 18499,
    popularityScore: 93,
    image:
      "https://images.unsplash.com/photo-1626621331169-5d4f5f0f5d7a?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Snow points, valley views, adventure activities, and cozy mountain stays.",
    highlights: ["Solang Valley", "Atal Tunnel Drive", "Old Manali Evening"],
  },
  {
    slug: "rajasthan-royal-heritage-6n-7d",
    name: "Rajasthan Royal Heritage",
    destination: "Jaipur - Jodhpur - Udaipur",
    category: "Heritage",
    durationDays: 7,
    durationNights: 6,
    pricePerPerson: 22999,
    popularityScore: 90,
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Fort cities, royal palaces, colorful bazaars, and desert culture.",
    highlights: ["Amber Fort", "Mehrangarh Fort", "Lake Pichola Boat Ride"],
  },
  {
    slug: "char-dham-yatra-10n-11d",
    name: "Char Dham Yatra",
    destination: "Uttarakhand",
    category: "Pilgrimage",
    durationDays: 11,
    durationNights: 10,
    pricePerPerson: 34999,
    popularityScore: 89,
    image:
      "https://images.unsplash.com/photo-1626621615481-2184f413f0f0?auto=format&fit=crop&w=1400&q=80",
    summary:
      "A spiritually rich Himalayan pilgrimage with reliable travel planning.",
    highlights: ["Yamunotri", "Gangotri", "Kedarnath & Badrinath"],
  },
  {
    slug: "kerala-backwater-retreat-4n-5d",
    name: "Kerala Backwater Retreat",
    destination: "Munnar - Alleppey",
    category: "Beach",
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 16999,
    popularityScore: 88,
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=80",
    summary: "Tea gardens, waterfalls, and serene houseboat experiences.",
    highlights: [
      "Munnar Tea Estates",
      "Alleppey Houseboat",
      "Kochi Sightseeing",
    ],
  },
  {
    slug: "dubai-city-luxury-4n-5d",
    name: "Dubai City Luxury",
    destination: "Dubai",
    category: "International",
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 52999,
    popularityScore: 92,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Skyline icons, desert safari, shopping, and premium city experiences.",
    highlights: ["Burj Khalifa", "Desert Safari", "Marina Cruise"],
  },
  {
    slug: "shimla-kufri-leisure-3n-4d",
    name: "Shimla Kufri Leisure",
    destination: "Shimla",
    category: "Hill",
    durationDays: 4,
    durationNights: 3,
    pricePerPerson: 13999,
    popularityScore: 84,
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Relaxed hill holiday with scenic drives and family-friendly attractions.",
    highlights: ["Mall Road", "Kufri Excursion", "Jakhoo Temple"],
  },
  {
    slug: "ooty-coonoor-family-4n-5d",
    name: "Ooty Coonoor Family Tour",
    destination: "Ooty - Coonoor",
    category: "Family",
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 15499,
    popularityScore: 82,
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80",
    summary: "Toy train charm, botanical gardens, and cool weather escapes.",
    highlights: ["Nilgiri Toy Train", "Botanical Garden", "Doddabetta Peak"],
  },
  {
    slug: "varanasi-spiritual-trail-3n-4d",
    name: "Varanasi Spiritual Trail",
    destination: "Varanasi",
    category: "Pilgrimage",
    durationDays: 4,
    durationNights: 3,
    pricePerPerson: 12499,
    popularityScore: 83,
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1400&q=80",
    summary: "Ganga aarti, ghats, temples, and timeless spiritual ambience.",
    highlights: ["Dashashwamedh Ghat", "Kashi Vishwanath", "Sarnath Visit"],
  },
  {
    slug: "andaman-island-delight-5n-6d",
    name: "Andaman Island Delight",
    destination: "Port Blair - Havelock",
    category: "Beach",
    durationDays: 6,
    durationNights: 5,
    pricePerPerson: 31999,
    popularityScore: 87,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    summary: "Crystal beaches, water activities, and island-hopping adventure.",
    highlights: ["Radhanagar Beach", "Cellular Jail", "Snorkeling Session"],
  },
  {
    slug: "shirdi-nashik-devotion-2n-3d",
    name: "Shirdi Nashik Devotion",
    destination: "Shirdi - Nashik",
    category: "Pilgrimage",
    durationDays: 3,
    durationNights: 2,
    pricePerPerson: 8999,
    popularityScore: 80,
    image:
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Comfortable spiritual circuit with darshan planning and local transfers.",
    highlights: ["Sai Baba Temple", "Trimbakeshwar", "Godavari Ghats"],
  },
  {
    slug: "agra-jaipur-heritage-mini-3n-4d",
    name: "Agra Jaipur Heritage Mini",
    destination: "Agra - Jaipur",
    category: "Heritage",
    durationDays: 4,
    durationNights: 3,
    pricePerPerson: 14999,
    popularityScore: 81,
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Iconic monuments and royal heritage with efficient itinerary flow.",
    highlights: ["Taj Mahal", "City Palace", "Local Craft Markets"],
  },
  {
    slug: "bali-romantic-hideaway-5n-6d",
    name: "Bali Romantic Hideaway",
    destination: "Bali",
    category: "Honeymoon",
    durationDays: 6,
    durationNights: 5,
    pricePerPerson: 58999,
    popularityScore: 94,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80",
    summary: "Private villas, beach sunsets, and curated honeymoon moments.",
    highlights: ["Ubud Day Tour", "Nusa Penida", "Candlelight Dinner"],
  },
  {
    slug: "singapore-family-fun-4n-5d",
    name: "Singapore Family Fun",
    destination: "Singapore",
    category: "Family",
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 61999,
    popularityScore: 86,
    image:
      "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Urban attractions, theme parks, and smooth family-friendly logistics.",
    highlights: ["Sentosa Island", "Gardens by the Bay", "Universal Studios"],
  },
  {
    slug: "kashmir-paradise-5n-6d",
    name: "Kashmir Paradise",
    destination: "Srinagar - Gulmarg - Pahalgam",
    category: "Hill",
    durationDays: 6,
    durationNights: 5,
    pricePerPerson: 27999,
    popularityScore: 91,
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=80",
    summary: "Snow meadows, houseboat stays, and postcard-perfect valleys.",
    highlights: ["Dal Lake Shikara", "Gulmarg Gondola", "Pahalgam Valley"],
  },
  {
    slug: "mumbai-lonavala-weekend-2n-3d",
    name: "Mumbai Lonavala Weekend",
    destination: "Mumbai - Lonavala",
    category: "Family",
    durationDays: 3,
    durationNights: 2,
    pricePerPerson: 9999,
    popularityScore: 76,
    image:
      "https://images.unsplash.com/photo-1526483360412-f4dbaf036963?auto=format&fit=crop&w=1400&q=80",
    summary: "Quick city-and-hills break with comfort-focused travel plans.",
    highlights: ["Marine Drive", "Lonavala Viewpoints", "Local Food Trail"],
  },
  {
    slug: "tirupati-balaji-pilgrimage-2n-3d",
    name: "Tirupati Balaji Pilgrimage",
    destination: "Tirupati",
    category: "Pilgrimage",
    durationDays: 3,
    durationNights: 2,
    pricePerPerson: 10999,
    popularityScore: 79,
    image:
      "https://images.unsplash.com/photo-1619946794135-5bc917a27793?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Convenient darshan package with temple visit support and transfers.",
    highlights: ["Balaji Darshan", "Padmavathi Temple", "Local Temples"],
  },
  {
    slug: "thailand-tropical-escape-5n-6d",
    name: "Thailand Tropical Escape",
    destination: "Bangkok - Pattaya",
    category: "International",
    durationDays: 6,
    durationNights: 5,
    pricePerPerson: 48999,
    popularityScore: 88,
    image:
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Tropical fun with city tours, beach vibes, and nightlife options.",
    highlights: ["Coral Island", "Bangkok City Tour", "Alcazar Show"],
  },
  {
    slug: "munnar-thekkady-nature-4n-5d",
    name: "Munnar Thekkady Nature",
    destination: "Munnar - Thekkady",
    category: "Hill",
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 15999,
    popularityScore: 85,
    image:
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1400&q=80",
    summary: "Green landscapes, wildlife experiences, and peaceful hill stays.",
    highlights: ["Periyar Lake", "Tea Museum", "Spice Plantation"],
  },
  {
    slug: "udaipur-romantic-lakes-3n-4d",
    name: "Udaipur Romantic Lakes",
    destination: "Udaipur",
    category: "Honeymoon",
    durationDays: 4,
    durationNights: 3,
    pricePerPerson: 17999,
    popularityScore: 87,
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Lakeside palaces, cultural evenings, and romantic sunset cruises.",
    highlights: ["City Palace", "Saheliyon Ki Bari", "Lake Pichola Cruise"],
  },
  {
    slug: "gujarat-heritage-exploration-4n-5d",
    name: "Gujarat Heritage Exploration",
    destination: "Gujarat",
    category: "Pilgrimage",
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 12999,
    popularityScore: 88,
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Discover Gujarat's iconic Rann of Kutch, the Somnath temple, and vibrant cultural heritage.",
    highlights: [
      "Rann of Kutch",
      "Somnath Temple",
      "Gir National Park",
      "Dwarka Dham",
    ],
  },
  {
    slug: "maldives-overwater-retreat-5n-6d",
    name: "Maldives Overwater Retreat",
    destination: "Maldives",
    category: "International",
    durationDays: 6,
    durationNights: 5,
    pricePerPerson: 74999,
    popularityScore: 96,
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80",
    summary:
      "Crystal-clear lagoons, overwater bungalows, and world-class snorkelling in paradise.",
    highlights: [
      "Overwater Villa",
      "Snorkelling & Diving",
      "Sunset Dolphin Cruise",
      "Spa on Water",
    ],
  },
];

export const travelPackages: TravelPackage[] = packageSeeds.map((item) => {
  const safeCategory = PACKAGE_CATEGORIES.includes(item.category)
    ? item.category
    : "Family";

  return {
    ...item,
    category: safeCategory,
    status: "active" as PackageStatus,
    durationLabel: `${item.durationNights} Nights / ${item.durationDays} Days`,
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
    itinerary: buildItinerary(
      item.destination,
      item.durationDays,
      item.highlights,
    ),
  };
});

export const getPackageSlugs = () => travelPackages.map((item) => item.slug);

export const getPackageBySlug = (slug: string) =>
  travelPackages.find((item) => item.slug === slug);

export const getRelatedPackages = (
  slug: string,
  limit = 3,
): TravelPackage[] => {
  const current = getPackageBySlug(slug);
  if (!current) {
    return [];
  }

  return travelPackages
    .filter((item) => item.slug !== slug && item.category === current.category)
    .slice(0, limit);
};

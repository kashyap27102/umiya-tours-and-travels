import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, CardTitle, CardBody } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import BrandLogo from "@/components/BrandLogo";

export const metadata = createMetadata({
  title: "Our Services | Umiya Tours & Travels",
  description:
    "Explore Umiya Tours & Travels services: custom tour packages, cab booking, airport & railway transfers, and group vehicle hire in Gujarat.",
  path: "/services",
  keywords: [
    "travel services Gujarat",
    "cab booking Gandhinagar",
    "tempo traveller hire",
    "airport transfer Gujarat",
    "bus booking Gujarat",
  ],
});

const CAB_TYPES = [
  {
    label: "One Way",
    desc: "Point A to B. Intercity & intracity.",
  },
  {
    label: "Round Trip",
    desc: "Return journey included at a fixed rate.",
  },
  {
    label: "Airport Pickup / Drop",
    desc: "24×7, with flight tracking & meet & greet.",
  },
  {
    label: "Railway Transfer",
    desc: "Synced with train schedules, no waiting.",
  },
];

const VEHICLES = [
  {
    type: "Tempo Traveller",
    capacity: "9–14 Seats",
    best: "Family trips, small group tours",
  },
  {
    type: "Mini Bus",
    capacity: "20–27 Seats",
    best: "School trips, medium groups",
  },
  {
    type: "Full-Size Bus",
    capacity: "35–50+ Seats",
    best: "Corporate tours, large pilgrimages",
  },
];

const PACKAGE_CATEGORIES = [
  { emoji: "🏖️", label: "Beach Getaways", examples: "Goa, Kerala, Andaman" },
  {
    emoji: "🏔️",
    label: "Hill Stations",
    examples: "Manali, Shimla, Ooty, Munnar",
  },
  {
    emoji: "🕌",
    label: "Heritage & Culture",
    examples: "Rajasthan, Varanasi, Agra",
  },
  {
    emoji: "🙏",
    label: "Pilgrimage Tours",
    examples: "Char Dham, Shirdi, Tirupati",
  },
  {
    emoji: "🌍",
    label: "International",
    examples: "Dubai, Thailand, Bali, Singapore",
  },
  {
    emoji: "💑",
    label: "Honeymoon Specials",
    examples: "Customised romantic itineraries",
  },
];

export default function ServicesPage() {
  return (
    <main className="travel-shell flex flex-col gap-16 py-10 md:py-14">
      <Breadcrumb crumbs={[{ label: "Services" }]} />

      {/* Hero intro */}
      <section className="max-w-2xl">
        <Badge variant="brand" className="mb-4" size="md">
          What We Do
        </Badge>
        <h1 className="text-4xl font-bold text-brand-ink-900 md:text-5xl">
          Complete Travel Solutions Under One Roof
        </h1>
        <p className="mt-5 text-brand-muted-600 leading-relaxed text-base md:text-lg">
          From booking a quick cab to planning a full international holiday,
          Umiya Tours & Travels is your all-in-one travel partner in Gujarat.
        </p>
      </section>

      {/* 1. Custom Packages */}
      <section id="custom-packages" className="scroll-mt-20">
        <div className="mb-6">
          <Badge variant="accent" className="mb-3">
            Service 01
          </Badge>
          <h2 className="text-2xl font-bold text-brand-ink-900 md:text-3xl">
            Customized Travel Packages
          </h2>
          <p className="mt-2 text-brand-muted-600 max-w-xl">
            We design personalised itineraries around your interests, budget,
            and timeline. Hotel, transport, sightseeing — all bundled.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGE_CATEGORIES.map((cat) => (
            <Card
              key={cat.label}
              variant="default"
              padding="md"
              className="flex items-start gap-4"
            >
              <span className="text-3xl" role="img" aria-label={cat.label}>
                {cat.emoji}
              </span>
              <div>
                <CardTitle className="text-base">{cat.label}</CardTitle>
                <CardBody className="text-xs mt-1">{cat.examples}</CardBody>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Button asChild variant="solid" size="md">
            <Link href="/contact?service=custom-packages">Plan My Trip</Link>
          </Button>
        </div>
      </section>

      {/* 2. Cab Booking */}
      <section id="cab-booking" className="scroll-mt-20">
        <div className="mb-6">
          <Badge variant="accent" className="mb-3">
            Service 02
          </Badge>
          <h2 className="text-2xl font-bold text-brand-ink-900 md:text-3xl">
            Cab Booking
          </h2>
          <p className="mt-2 text-brand-muted-600 max-w-xl">
            Reliable, on-time rides across Gujarat. Choose from Sedan, SUV,
            Innova Crysta, or Luxury vehicles.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAB_TYPES.map((t) => (
            <Card key={t.label} variant="tinted" padding="md">
              <CardTitle className="text-base mb-1">{t.label}</CardTitle>
              <CardBody className="text-xs">{t.desc}</CardBody>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Button asChild variant="primary" size="md">
            <Link href="/cab-booking">Book a Cab</Link>
          </Button>
        </div>
      </section>

      {/* 3. Group Vehicles */}
      <section id="vehicle-booking" className="scroll-mt-20">
        <div className="mb-6">
          <Badge variant="accent" className="mb-3">
            Service 03
          </Badge>
          <h2 className="text-2xl font-bold text-brand-ink-900 md:text-3xl">
            Travel Vehicle Booking (Group Transport)
          </h2>
          <p className="mt-2 text-brand-muted-600 max-w-xl">
            Perfect for large groups heading to tours, weddings, pilgrimage
            yatras, or corporate events.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-brand-blue-700 text-brand-cream-100">
                <th className="text-left px-5 py-3 rounded-tl-xl font-semibold">
                  Vehicle
                </th>
                <th className="text-left px-5 py-3 font-semibold">Capacity</th>
                <th className="text-left px-5 py-3 rounded-tr-xl font-semibold">
                  Best For
                </th>
              </tr>
            </thead>
            <tbody>
              {VEHICLES.map((v, i) => (
                <tr
                  key={v.type}
                  className={i % 2 === 0 ? "bg-white" : "bg-brand-mist-200"}
                >
                  <td className="px-5 py-3 font-medium text-brand-ink-900">
                    {v.type}
                  </td>
                  <td className="px-5 py-3 text-brand-muted-600">
                    {v.capacity}
                  </td>
                  <td className="px-5 py-3 text-brand-muted-600">{v.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <Button asChild variant="solid" size="md">
            <Link href="/vehicle-booking">Hire a Vehicle</Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="brand-hero relative overflow-hidden rounded-3xl px-8 py-14 text-center">
        <div className="brand-hero-glow pointer-events-none absolute inset-0" />
        <BrandLogo
          variant="white"
          size="lg"
          decorative
          className="pointer-events-none absolute right-4 top-4 h-10 w-auto opacity-60 md:right-6 md:top-6 md:h-14"
        />
        <h2 className="relative text-3xl font-bold text-brand-cream-100 md:text-4xl">
          Not Sure Which Service Fits You?
        </h2>
        <p className="relative mt-3 text-brand-mist-200">
          Chat with us and we will plan the perfect trip for you.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild variant="primary" size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button asChild variant="hero-outline" size="lg">
            <Link href="/packages">View Packages</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

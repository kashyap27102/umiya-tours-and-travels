import { Badge, Button, Card, CardBody, CardTitle } from "@/components/ui";
import CtaBanner from "@/components/CtaBanner";
import { createMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";

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

type ServiceShowcaseProps = {
  id: string;
  indexLabel: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  ctaHref: string;
  ctaLabel: string;
  reverse?: boolean;
  children: React.ReactNode;
};

function ServiceShowcase({
  id,
  title,
  description,
  imageSrc,
  imageAlt,
  ctaHref,
  ctaLabel,
  reverse = false,
  children,
}: ServiceShowcaseProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className={reverse ? "lg:order-2" : undefined}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-brand-ink-900 md:text-3xl">
              {title}
            </h2>
            <p className="mt-3 max-w-xl text-brand-muted-600 md:text-base">
              {description}
            </p>
          </div>

          <div className="space-y-4">{children}</div>

          <div className="mt-6">
            <Button asChild variant="solid" size="md">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        </div>

        <div className={reverse ? "lg:order-1" : undefined}>
          <div className="relative overflow-hidden rounded-4xl border border-brand-blue-900/10 bg-white shadow-[0_16px_40px_rgb(var(--brand-blue-rgb)/0.14)]">
            <div className="absolute inset-0 bg-linear-to-t from-brand-blue-900/35 via-transparent to-transparent" />
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1200}
              height={900}
              className="h-80 w-full object-cover md:h-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute bottom-0 left-0 right-0 flex flex-wrap gap-2 p-4 md:p-6">
              <Badge variant="solid" size="sm">
                Trusted Planning
              </Badge>
              <Badge variant="solid" size="sm">
                Comfortable Travel
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <main className="travel-shell flex flex-col gap-16 py-10 md:py-14">
      <ServiceShowcase
        id="custom-packages"
        indexLabel="Service 01"
        title="Customized Travel Packages"
        description="We design personalised itineraries around your interests, budget, and timeline. Hotels, transport, sightseeing, and day plans come together in one well-paced trip."
        imageSrc="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Mountain travel destination with scenic landscape"
        ctaHref="/contact?service=custom-packages"
        ctaLabel="Plan My Trip"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGE_CATEGORIES.map((cat) => (
            <Card
              key={cat.label}
              variant="default"
              padding="md"
              className="flex flex-col items-start gap-4"
            >
              <span className="text-3xl" role="img" aria-label={cat.label}>
                {cat.emoji}
              </span>
              <div>
                <CardTitle className="text-base">{cat.label}</CardTitle>
                <CardBody className="mt-1 text-xs">{cat.examples}</CardBody>
              </div>
            </Card>
          ))}
        </div>
      </ServiceShowcase>

      <ServiceShowcase
        id="cab-booking"
        indexLabel="Service 02"
        title="Cab Booking"
        description="Reliable, on-time rides across Gujarat for airport transfers, railway pickups, local travel, and outstation plans. Choose the vehicle that matches your comfort and group size."
        imageSrc="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Premium travel car driving on scenic road"
        ctaHref="/cab-booking"
        ctaLabel="Book a Cab"
        reverse
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {CAB_TYPES.map((t) => (
            <Card key={t.label} variant="tinted" padding="md">
              <CardTitle className="mb-1 text-base">{t.label}</CardTitle>
              <CardBody className="text-xs">{t.desc}</CardBody>
            </Card>
          ))}
        </div>
      </ServiceShowcase>

      <ServiceShowcase
        id="vehicle-booking"
        indexLabel="Service 03"
        title="Travel Vehicle Booking (Group Transport)"
        description="Perfect for school trips, weddings, tours, yatras, and corporate outings. We help you choose the right vehicle capacity and route setup for a smooth group journey."
        imageSrc="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Large travel bus on highway"
        ctaHref="/vehicle-booking"
        ctaLabel="Hire a Vehicle"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {VEHICLES.map((v) => (
            <Card
              key={v.type}
              variant="elevated"
              padding="md"
              className="flex h-full flex-col"
            >
              <Badge variant="brand" size="sm" className="mb-4 w-fit">
                {v.capacity}
              </Badge>
              <CardTitle className="mb-2 text-lg">{v.type}</CardTitle>
              <CardBody className="flex-1">{v.best}</CardBody>
            </Card>
          ))}
        </div>
      </ServiceShowcase>

      {/* CTA */}
      <CtaBanner
        heading="Not Sure Which Service Fits You?"
        description="Chat with us and we will plan the perfect trip for you."
        showLogo
        actions={[
          { label: "Contact Us", href: "/contact" },
          { label: "View Packages", href: "/packages", variant: "hero-outline" },
        ]}
      />
    </main>
  );
}

import { createMetadata } from "@/lib/metadata";
import { Card, CardTitle, CardBody } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import BrandLogo from "@/components/BrandLogo";
import SectionHeading from "@/components/SectionHeading";
import CtaBanner from "@/components/CtaBanner";
import Image from "next/image";
import Link from "next/link";
import { SettingsService } from "@/services";
import {
  Award,
  MapPin,
  Users,
  Clock,
  ShieldCheck,
  Armchair,
  Handshake,
  HeartHandshake,
} from "lucide-react";

export const metadata = createMetadata({
  title: "About Us & Services | Umiya Tours & Travels",
  description:
    "Learn about Umiya Tours & Travels — our story, values, and services: custom tour packages, cab booking, airport & railway transfers, and group vehicle hire in Gujarat.",
  path: "/about",
  keywords: [
    "about Umiya Tours",
    "travel agency Gandhinagar",
    "Gujarat travel company",
    "travel services Gujarat",
    "cab booking Gandhinagar",
    "tempo traveller hire",
    "airport transfer Gujarat",
    "bus booking Gujarat",
  ],
});

const STAT_ICONS = [Award, MapPin, Users, Clock];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    body: "All our vehicles are regularly serviced. Our drivers are trained and verified for your peace of mind.",
  },
  {
    icon: Armchair,
    title: "Maximum Comfort",
    body: "From AC cabs to luxury coaches, every vehicle is kept clean and comfortable for every trip.",
  },
  {
    icon: Handshake,
    title: "Reliability",
    body: "We show up on time — always. Our customers trust us because we take punctuality seriously.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    body: "Your satisfaction is our priority. We tailor every journey to your specific needs and budget.",
  },
];

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

const CARD_HOVER =
  "transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgb(var(--brand-blue-rgb)/0.18)]";

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
  indexLabel,
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
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-blue-700">
              {indexLabel}
            </p>
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
          <div className="group relative overflow-hidden rounded-4xl border border-brand-blue-900/10 bg-white shadow-[0_16px_40px_rgb(var(--brand-blue-rgb)/0.14)]">
            <div className="absolute inset-0 z-10 bg-linear-to-t from-brand-blue-900/35 via-transparent to-transparent" />
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1200}
              height={900}
              className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-wrap gap-2 p-4 md:p-6">
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

export default async function AboutPage() {
  const settings = await SettingsService.getCachedSettings();

  return (
    <main className="travel-shell flex flex-col gap-16 py-10 md:py-14">
      {/* Hero / Story */}
      <section className="brand-hero relative overflow-hidden rounded-3xl px-6 py-14 md:px-12 md:py-20">
        <div className="brand-hero-glow pointer-events-none absolute inset-y-0 right-0 w-1/2" />
        <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-brand-lime-400/20 blur-3xl motion-float-slow" />
        <div className="pointer-events-none absolute -right-10 bottom-8 h-52 w-52 rounded-full bg-brand-blue-500/30 blur-3xl motion-float-medium" />
        <BrandLogo
          variant="white"
          size="lg"
          decorative
          className="pointer-events-none absolute right-4 top-4 h-10 w-auto opacity-60 md:right-6 md:top-6 md:h-14"
        />

        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="motion-fade-up">
            <Badge
              variant="solid"
              size="md"
              className="mb-5 uppercase tracking-wider"
            >
              Our Story
            </Badge>
            <h1 className="text-4xl font-bold text-brand-cream-100 md:text-5xl">
              {settings?.aboutHeading ?? ""}
            </h1>
            <p className="mt-5 max-w-xl leading-relaxed text-brand-mist-200">
              {settings?.aboutDescription ?? ""}
            </p>
            <div className="mt-8">
              <Button asChild variant="primary" size="lg">
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>

          {/* Stats block */}
          <div className="grid grid-cols-2 gap-4">
            {(settings?.stats ?? []).map((s, i) => {
              const Icon = STAT_ICONS[i % STAT_ICONS.length];
              return (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-3 rounded-2xl bg-white/10 px-4 py-6 text-center backdrop-blur"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-lime-400/20 text-brand-lime-400">
                    <Icon size={22} aria-hidden />
                  </div>
                  <p className="text-3xl font-bold text-brand-cream-100">
                    {s.value}
                  </p>
                  <p className="text-xs text-brand-mist-200">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="flex flex-col gap-16">
        <SectionHeading
          badge="Our Services"
          title="Everything You Need, In One Place"
        />

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
                className={`flex flex-col items-start gap-4 ${CARD_HOVER}`}
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-lime-400/20 text-2xl"
                  role="img"
                  aria-label={cat.label}
                >
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
          id="vehicle-booking"
          indexLabel="Service 02"
          title="Vehicle Booking"
          description="One form for every ride — reliable cabs for airport transfers, railway pickups, local travel, and outstation plans, plus group vehicles for school trips, weddings, tours, yatras, and corporate outings."
          imageSrc="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80"
          imageAlt="Premium travel car driving on scenic road"
          ctaHref="/vehicle-booking"
          ctaLabel="Book Now"
          reverse
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {CAB_TYPES.map((t) => (
              <Card
                key={t.label}
                variant="tinted"
                padding="md"
                className="transition hover:-translate-y-1"
              >
                <CardTitle className="mb-1 text-base">{t.label}</CardTitle>
                <CardBody className="text-xs">{t.desc}</CardBody>
              </Card>
            ))}
          </div>
        </ServiceShowcase>
      </section>

      {/* Values */}
      <section>
        <SectionHeading badge="Our Values" title="What We Stand For" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <Card
              key={v.title}
              variant="default"
              padding="md"
              className={CARD_HOVER}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue-700/10 text-brand-blue-700">
                <v.icon size={22} aria-hidden />
              </div>
              <CardTitle className="mb-2">{v.title}</CardTitle>
              <CardBody>{v.body}</CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="brand-hero relative overflow-hidden rounded-3xl px-8 py-14">
        <div className="brand-hero-glow pointer-events-none absolute inset-y-0 right-0 w-1/2" />
        <div className="pointer-events-none absolute -left-12 bottom-6 h-40 w-40 rounded-full bg-brand-lime-400/20 blur-3xl motion-float-slow" />
        <BrandLogo
          variant="white"
          size="lg"
          decorative
          className="pointer-events-none absolute right-4 top-4 h-10 w-auto opacity-60 md:right-6 md:top-6 md:h-14"
        />
        <div className="relative max-w-2xl">
          <Badge variant="solid" className="mb-4">
            Our Mission
          </Badge>
          <h2 className="text-3xl font-bold text-brand-cream-100 md:text-4xl">
            {settings?.missionHeading ?? ""}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-mist-200">
            {settings?.missionDescription ?? ""}
          </p>
        </div>
      </section>
    </main>
  );
}

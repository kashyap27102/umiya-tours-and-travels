import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/metadata";
import HeroBanner from "@/components/HeroBanner";
import TestimonialCard from "@/components/TestimonialCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import TrendingPackages from "@/components/TrendingPackages";
import { Button } from "@/components/ui";
import { PackageService, SettingsService } from "@/services";
import type { Testimonial } from "@/types";

export const metadata = createMetadata({
  title: "Umiya Tours & Travels | Your Journey, Our Passion",
  description:
    "Travel with confidence using custom packages, cab booking, and group vehicles designed for family holidays, pilgrimages, and corporate tours.",
  path: "/",
  keywords: [
    "travel agency Gandhinagar",
    "cab booking Gujarat",
    "tour packages Gandhinagar",
    "group vehicle hire",
    "Umiya Tours",
  ],
});

const SERVICES = [
  {
    title: "Custom Packages",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    ctaLabel: "Plan My Trip",
    ctaHref: "/services#custom-packages",
  },
  {
    title: "Cab Booking",
    image:
      "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80",
    ctaLabel: "Book a Cab",
    ctaHref: "/cab-booking",
  },
  {
    title: "Group Vehicles",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    ctaLabel: "Hire a Vehicle",
    ctaHref: "/vehicle-booking",
  },
  {
    title: "Pre-Designed Tours",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    ctaLabel: "View Packages",
    ctaHref: "/packages",
  },
];

const DOMESTIC_SLUGS = [
  "kashmir-paradise-5n-6d",
  "shimla-kufri-leisure-3n-4d",
  "gujarat-heritage-exploration-4n-5d",
];

const INTERNATIONAL_SLUGS = [
  "dubai-city-luxury-4n-5d",
  "maldives-overwater-retreat-5n-6d",
  "bali-romantic-hideaway-5n-6d",
];

const DESTINATION_MOMENTS = [
  {
    src: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
    alt: "Friends enjoying a road trip",
  },
  {
    src: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1200&q=80",
    alt: "Beautiful mountain sunrise",
  },
  {
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    alt: "Adventure at a scenic cliff viewpoint",
  },
  {
    src: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&q=80",
    alt: "Airplane wing view over landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    alt: "Travel landscape with forest and mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    alt: "Clear tropical sea and beach",
  },
];

export default async function Home() {
  const [settings, activePackagesResult] = await Promise.all([
    SettingsService.getCachedSettings(),
    PackageService.getCachedActivePackages(),
  ]);
  const activePackages = activePackagesResult.success
    ? activePackagesResult.data
    : [];

  const domesticPackages = DOMESTIC_SLUGS.map((slug) =>
    activePackages.find((p) => p.slug === slug),
  ).filter((p) => p !== undefined);
  const internationalPackages = INTERNATIONAL_SLUGS.map((slug) =>
    activePackages.find((p) => p.slug === slug),
  ).filter((p) => p !== undefined);

  return (
    <main className="flex flex-col gap-16 ">
      {/* Hero */}
      <HeroBanner
        heading={settings?.heroHeading ?? ""}
        subheading={settings?.heroSubheading ?? ""}
        primaryCta={{ label: "Explore Packages", href: "/packages" }}
        imageSrc="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1800&q=80"
        imageAlt="Scenic tropical destination with turquoise water"
      />

      {/* Trending packages */}
      <TrendingPackages
        domestic={domesticPackages}
        international={internationalPackages}
      />

      {/* Visual service cards */}
      <section className="travel-shell">
        <div className="mb-8 max-w-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-blue-700">
            Services
          </p>
          <h2 className="text-3xl font-bold text-brand-ink-900 md:text-4xl">
            Pick Your Travel Style
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              href={service.ctaHref}
              className="group relative overflow-hidden rounded-3xl border border-brand-blue-900/10 bg-white shadow-[0_12px_32px_rgb(var(--brand-blue-rgb)/0.12)] motion-fade-up"
            >
              <Image
                src={service.image}
                alt={service.title}
                width={1000}
                height={900}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-blue-900/75 via-brand-blue-900/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-xl font-semibold text-brand-cream-100">
                  {service.title}
                </h3>
                <p className="mt-1 text-sm text-brand-mist-200">
                  {service.ctaLabel}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="travel-shell">
        <WhyChooseUs />
      </section>

      {/* Testimonials */}
      <section className="travel-shell">
        <div className="mb-8 max-w-lg">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-blue-700">
            Traveller Stories
          </p>
          <h2 className="text-3xl font-bold text-brand-ink-900 md:text-4xl">
            Happy Faces, Real Journeys
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(settings?.testimonials ?? []).map((t: Testimonial) => (
            <TestimonialCard
              key={t.name}
              name={t.name}
              location={t.location}
              rating={t.rating as 1 | 2 | 3 | 4 | 5}
              review={t.review}
            />
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="travel-shell">
        <div className="brand-hero relative overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16">
          <Image
            src="https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1800&q=80"
            alt="Travel collage background"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover opacity-20"
          />
          <div className="brand-hero-glow pointer-events-none absolute inset-0" />
          <h2 className="relative text-3xl font-bold text-brand-cream-100 md:text-4xl">
            Ready to Turn These Visuals Into Your Real Trip?
          </h2>
          <p className="relative mt-3 text-brand-mist-200 text-base md:text-lg">
            Share your dream destination. We will craft the route, stay, and
            transport.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="primary" size="lg">
              <Link href="/contact">Talk to an Expert</Link>
            </Button>
            <Button asChild variant="hero-outline" size="lg">
              <Link href="/packages">Browse Packages</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

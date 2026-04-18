import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import HeroBanner from "@/components/HeroBanner";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import { Button } from "@/components/ui";

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
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
    title: "Custom Packages",
    description:
      "Fully tailored itineraries for families, couples, and groups. We plan every detail so you just show up and enjoy.",
    ctaLabel: "Plan My Trip",
    ctaHref: "/services#custom-packages",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    ),
    title: "Cab Booking",
    description:
      "One-way, round trip, and airport or railway transfers. Book a Sedan, SUV, or Innova Crysta in minutes.",
    ctaLabel: "Book a Cab",
    ctaHref: "/cab-booking",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
      </svg>
    ),
    title: "Group Vehicles",
    description:
      "Tempo Traveller, Mini Bus, or full Bus for corporate tours, pilgrimages, weddings, and large groups.",
    ctaLabel: "Hire a Vehicle",
    ctaHref: "/vehicle-booking",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
      </svg>
    ),
    title: "Pre-Designed Tours",
    description:
      "Ready-to-book packages across beaches, hill stations, heritage sites, pilgrimages, and international destinations.",
    ctaLabel: "View Packages",
    ctaHref: "/packages",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Ahmedabad, Gujarat",
    rating: 5 as const,
    review:
      "Umiya made our Goa trip absolutely seamless. The cab was on time, the hotel was perfect. Will book again!",
  },
  {
    name: "Rahul Patel",
    location: "Gandhinagar, Gujarat",
    rating: 5 as const,
    review:
      "Excellent service for our company offsite to Udaipur. The tempo traveller was comfortable and the driver was very professional.",
  },
  {
    name: "Meena Desai",
    location: "Anand, Gujarat",
    rating: 4 as const,
    review:
      "Booked a Char Dham package for my parents. Everything was arranged perfectly — truly a worry-free pilgrimage.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col gap-16 py-8 md:py-12">
      {/* Hero */}
      <div className="travel-shell">
        <HeroBanner
          heading="Discover Journeys That Feel Personal, Smooth & Memorable"
          subheading="From curated holidays to dependable cabs and group vehicles — we help you and your family travel with comfort and confidence."
          primaryCta={{ label: "Explore Packages", href: "/packages" }}
          secondaryCta={{ label: "Book Now", href: "/cab-booking" }}
        />
      </div>

      {/* Services */}
      <section className="travel-shell">
        <div className="mb-8 max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue-700 mb-2">
            What We Offer
          </p>
          <h2 className="text-3xl font-bold text-brand-ink-900 md:text-4xl">
            All Your Travel Needs, One Roof
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} {...s} />
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
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue-700 mb-2">
            Traveller Stories
          </p>
          <h2 className="text-3xl font-bold text-brand-ink-900 md:text-4xl">
            Loved by Families Across Gujarat
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="travel-shell">
        <div className="brand-hero rounded-3xl px-8 py-14 text-center md:px-16">
          <div className="brand-hero-glow pointer-events-none absolute inset-0" />
          <h2 className="relative text-3xl font-bold text-brand-cream-100 md:text-4xl">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="relative mt-3 text-brand-mist-200 text-base md:text-lg">
            Talk to our travel experts — no booking fees, no fuss.
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

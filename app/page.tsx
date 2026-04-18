import Link from "next/link";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Umiya Tours & Travels | Your Journey, Our Passion",
  description:
    "Travel with confidence using custom packages, cab booking, and group vehicles designed for family holidays, pilgrimages, and corporate tours.",
  path: "/",
});

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="travel-shell flex w-full flex-1 flex-col gap-16 py-10 md:py-16">
        <section className="brand-hero relative overflow-hidden rounded-3xl px-6 py-16 shadow-xl md:px-12">
          <div className="brand-hero-glow absolute inset-y-0 right-0 w-1/2" />
          <div className="relative z-10 max-w-2xl">
            <p className="text-brand-mist-200 mb-3 text-sm font-semibold uppercase tracking-[0.22em]">
              Umiya Tours & Travels
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Discover Journeys That Feel Personal, Smooth, and Memorable
            </h1>
            <p className="text-brand-mist-200 mt-5 max-w-xl text-base md:text-lg">
              From curated holidays to dependable cabs and group vehicles, we
              help you travel with comfort and confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/packages"
                className="btn-brand-primary inline-flex min-h-11 items-center justify-center rounded-full px-6 py-2 text-sm font-semibold transition"
              >
                Explore Packages
              </Link>
              <Link
                href="/contact"
                className="btn-brand-secondary inline-flex min-h-11 items-center justify-center rounded-full px-6 py-2 text-sm font-semibold transition"
              >
                Book Now
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Custom Packages",
              body: "Tailored itineraries for families, couples, and groups.",
            },
            {
              title: "Cab Booking",
              body: "Airport, railway, one-way and round-trip rides.",
            },
            {
              title: "Group Vehicles",
              body: "Tempo travellers, mini buses, and full buses on demand.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="card-brand rounded-2xl p-6 backdrop-blur"
            >
              <h2 className="text-brand-ink-900 text-2xl font-semibold">
                {item.title}
              </h2>
              <p className="text-brand-muted-600 mt-2 text-sm">{item.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

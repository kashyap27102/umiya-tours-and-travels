import PackagesCatalog from "@/components/packages/PackagesCatalog";
import { Button } from "@/components/ui";
import { createMetadata } from "@/lib/metadata";
import { travelPackages } from "@/lib/packages-data";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Travel Packages | Umiya Tours & Travels",
  description:
    "Browse curated beach, hill, heritage, pilgrimage, family, honeymoon, and international packages with filters by destination, duration, and budget.",
  path: "/packages",
  keywords: [
    "travel packages gujarat",
    "family tour packages",
    "honeymoon packages india",
    "pilgrimage package booking",
    "international holiday packages",
  ],
});

export default function PackagesPage() {
  return (
    <main className="flex flex-col gap-10 ">
      <section className="brand-hero relative overflow-hidden px-6 py-10 md:px-10 md:py-12">
        <div className="brand-hero-glow pointer-events-none absolute inset-0" />
        <div className="relative max-w-3xl travel-shell ">
          <h1 className="text-4xl font-bold text-brand-cream-100 md:text-5xl">
            Find Your Perfect Travel Package
          </h1>
          <p className="mt-4 max-w-2xl text-base text-brand-mist-200 md:text-lg">
            Explore handpicked holiday options and filter by destination style,
            duration, and budget to book with confidence.
          </p>
        </div>
      </section>

      <div className="travel-shell flex flex-col gap-10">
        <PackagesCatalog packages={travelPackages} />

        <section className="brand-hero relative overflow-hidden rounded-3xl px-8 py-12 text-center md:px-12">
          <div className="brand-hero-glow pointer-events-none absolute inset-0" />
          <h2 className="relative text-3xl font-bold text-brand-cream-100 md:text-4xl">
            Need Help Choosing the Right Package?
          </h2>
          <p className="relative mt-3 text-base text-brand-mist-200 md:text-lg">
            Tell us your dates, group size, and budget. We will suggest the best
            options.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="primary" size="lg">
              <Link href="/contact?service=package">
                Get Package Recommendation
              </Link>
            </Button>
            <Button asChild variant="hero-outline" size="lg">
              <Link href="/contact?service=custom-packages">
                Request Custom Tour
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

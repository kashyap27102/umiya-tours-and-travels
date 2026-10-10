import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import { formatDurationLabel } from "@/lib/packages-constants";
import type { TrendingSection } from "@/services/trending-service";

/** The home page's featured packages. Heading and packages are set in the admin. */
export default function TrendingPackages({
  section,
}: Readonly<{ section: TrendingSection }>) {
  const { title, subtitle, packages } = section;
  if (packages.length === 0) return null;

  return (
    <section className="brand-hero py-14 md:py-16">
      <div className="travel-shell">
        {/* Section header */}
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold text-brand-cream-100 md:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-base text-brand-mist-200 md:text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* Package cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Link
              key={pkg.slug}
              href={`/packages/${pkg.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-brand-blue-900/8 bg-white shadow-[0_12px_32px_rgb(var(--brand-blue-rgb)/0.1)] transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgb(var(--brand-blue-rgb)/0.18)]"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={pkg.images[0] ?? "/logo.png"}
                  alt={pkg.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {pkg.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-blue-900 shadow">
                    {pkg.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 rounded-full bg-brand-blue-900/80 px-3 py-1 text-xs font-medium text-brand-cream-100">
                  {formatDurationLabel(pkg.durationNights, pkg.durationDays)}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col p-5">
                <p className="mb-1 text-xs font-medium text-brand-blue-700">
                  {pkg.destination}
                </p>
                <h3 className="mb-2 text-lg font-bold leading-tight text-brand-ink-900">
                  {pkg.name}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-brand-ink-600">
                  {pkg.summary}
                </p>

                {/* Highlights */}
                <ul className="mb-4 flex flex-wrap gap-2">
                  {pkg.highlights.slice(0, 3).map((h) => (
                    <li
                      key={h}
                      className="rounded-lg bg-brand-blue-50 px-3 py-1 text-xs text-brand-ink-700"
                    >
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="mt-auto flex items-center justify-between border-t border-brand-blue-900/8 pt-4">
                  <div>
                    <p className="text-xs text-brand-ink-500">Starting from</p>
                    <p className="text-xl font-bold text-brand-blue-900">
                      {formatCurrency(
                        pkg.startingPrice > 0
                          ? pkg.startingPrice
                          : pkg.pricePerPerson,
                      )}
                      <span className="text-xs font-normal text-brand-ink-500">
                        {" "}
                        / person
                      </span>
                    </p>
                  </div>
                  <span className="rounded-xl bg-brand-blue-900 px-4 py-2 text-sm font-semibold text-brand-cream-100 transition group-hover:bg-brand-blue-700">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* See all link */}
        <div className="mt-8 text-center">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-lime-400 hover:text-brand-cream-100 hover:underline"
          >
            See all packages →
          </Link>
        </div>
      </div>
    </section>
  );
}

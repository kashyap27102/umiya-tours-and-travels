"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDurationLabel } from "@/lib/packages-constants";
import type { PackageWithItinerary } from "@/types/package";

type Tab = "domestic" | "international";

const TAB_LABELS: Record<Tab, string> = {
  domestic: "🇮🇳 Domestic",
  international: "✈️ International",
};

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function TrendingPackages({
  domestic,
  international,
}: {
  domestic: PackageWithItinerary[];
  international: PackageWithItinerary[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("domestic");
  const packages = activeTab === "domestic" ? domestic : international;

  return (
    <section className="brand-hero py-14 md:py-16">
      <div className="travel-shell">
        {/* Section header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-lime-400">
              Trending Now
            </p>
            <h2 className="text-3xl font-bold text-brand-cream-100 md:text-4xl">
              Top Picks for You
            </h2>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 rounded-full border border-brand-blue-900/10 bg-white p-1 text-sm font-medium">
            {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={
                  "cursor-pointer rounded-full px-5 py-2 transition-colors " +
                  (activeTab === tab
                    ? "bg-brand-blue-900 text-brand-cream-100 shadow"
                    : "text-brand-ink-700 hover:bg-brand-blue-100")
                }
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
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
                {/* Category badge */}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-blue-900 shadow">
                  {pkg.category}
                </span>
                {/* Duration badge */}
                <span className="absolute bottom-3 right-3 rounded-full bg-brand-blue-900/80 px-3 py-1 text-xs font-medium text-brand-cream-100">
                  {formatDurationLabel(pkg.durationNights, pkg.durationDays)}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col p-5">
                <p className="mb-1 text-xs font-medium text-brand-blue-700">
                  {pkg.destination}
                </p>
                <h3 className="mb-2 text-lg font-bold text-brand-ink-900 leading-tight">
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
                      {formatPrice(pkg.pricePerPerson)}
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
            href={`/packages?category=${activeTab === "domestic" ? "" : "International"}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-lime-400 hover:text-brand-cream-100 hover:underline"
          >
            See all {activeTab} packages →
          </Link>
        </div>
      </div>
    </section>
  );
}

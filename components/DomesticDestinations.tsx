"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui";
import SectionHeading from "@/components/SectionHeading";
import type { Destination } from "@/lib/destinations";

interface DomesticDestinationsProps {
  destinations: Destination[];
}

export default function DomesticDestinations({
  destinations,
}: DomesticDestinationsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  if (destinations.length === 0) {
    return null;
  }

  return (
    <section className="travel-shell">
      <SectionHeading eyebrow="Explore India" title="Domestic Destinations" />

      <div className="group relative">
        <div
          ref={scrollerRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-2 py-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {destinations.map((destination) => (
            <Link
              key={destination.slug}
              href={`/packages?search=${encodeURIComponent(destination.searchTerm)}`}
              className="mx-1 w-56 flex-none snap-start motion-fade-up sm:w-64"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-3xl shadow-[0_12px_32px_rgb(var(--brand-blue-rgb)/0.15)] transition-transform duration-500 hover:scale-105">
                <Image
                  src={destination.image}
                  alt={destination.imageAlt}
                  fill
                  sizes="(max-width: 768px) 60vw, 256px"
                  style={{ objectPosition: destination.focalPoint ?? "center" }}
                  className="object-cover"
                />
              </div>
            </Link>
          ))}
        </div>

        <Button
          type="button"
          variant="solid"
          size="md"
          aria-label="Scroll to previous destinations"
          onClick={() => scrollByCards(-1)}
          className="absolute left-0 top-1/2 hidden -translate-y-1/2 rounded-full px-4 py-3 transition-all duration-300 hover:bg-brand-blue-900 lg:flex"
        >
          <span aria-hidden className="text-lg font-bold">
            ‹
          </span>
        </Button>

        <Button
          type="button"
          variant="solid"
          size="md"
          aria-label="Scroll to next destinations"
          onClick={() => scrollByCards(1)}
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-full px-4 py-3 transition-all duration-300 hover:bg-brand-blue-900 lg:flex"
        >
          <span aria-hidden className="text-lg font-bold">
            ›
          </span>
        </Button>
      </div>
    </section>
  );
}

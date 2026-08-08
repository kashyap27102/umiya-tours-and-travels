import Image from "next/image";
import Link from "next/link";
import { HorizontalScroller } from "@/components/ui";
import type { Destination } from "@/lib/destinations";

interface DomesticDestinationsProps {
  destinations: Destination[];
}

export default function DomesticDestinations({
  destinations,
}: DomesticDestinationsProps) {
  if (destinations.length === 0) {
    return null;
  }

  return (
    <section className="travel-shell">
      <HorizontalScroller
        eyebrow="Explore India"
        title="Domestic Destinations"
        itemLabel="destinations"
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
      </HorizontalScroller>
    </section>
  );
}

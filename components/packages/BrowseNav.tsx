import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Heart,
  Landmark,
  Mountain,
  Plane,
  Sparkles,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { Catalog, DestinationTile } from "@/services/catalog-service";
import PlaceThumb from "./PlaceThumb";

/** An icon per trip type; anything new falls back to a compass. */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  beach: Waves,
  hill: Mountain,
  heritage: Landmark,
  pilgrimage: Sparkles,
  international: Plane,
  honeymoon: Heart,
  family: Users,
};

// No frame at rest: the photo and name carry it. A soft white card appears on hover.
const placeClass =
  "group flex items-center gap-4 rounded-2xl p-2.5 transition-all hover:bg-white hover:shadow-[0_10px_28px_rgb(var(--brand-blue-rgb)/0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500";

const gridClass =
  "grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

/** A place: square photo on the left, name and its state (India) or country beside it. */
function DestinationCard({
  tile,
  domestic,
}: Readonly<{ tile: DestinationTile; domestic: boolean }>) {
  // Goa is in Goa, the Maldives are the Maldives: say something useful instead.
  const subtitle =
    tile.region && tile.region !== tile.name
      ? tile.region
      : domestic
        ? "India"
        : "International";
  return (
    <Link href={`/destinations/${tile.slug}`} className={placeClass}>
      <PlaceThumb src={tile.image} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-semibold text-brand-ink-900">
          {tile.name}
        </span>
        <span className="mt-0.5 block text-sm leading-snug text-brand-muted-600">
          {subtitle}
        </span>
      </span>
      <ArrowRight
        className="h-4 w-4 shrink-0 -translate-x-1 text-brand-blue-700 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
        aria-hidden
      />
    </Link>
  );
}

function SectionTitle({ eyebrow, title }: Readonly<{ eyebrow: string; title: string }>) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-blue-700">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold text-brand-ink-900 md:text-4xl">
        {title}
      </h2>
    </div>
  );
}

/**
 * The top of /packages: destinations as photo tiles (India, then abroad),
 * then trip types. Every item is a plain link to its own page, rendered on
 * the server, so search engines can follow all of them.
 */
export default function BrowseNav({ catalog }: Readonly<{ catalog: Catalog }>) {
  const rows = [
    { eyebrow: "Explore India", title: "Where would you like to go?", tiles: catalog.tiles.domestic, domestic: true },
    { eyebrow: "Holidays abroad", title: "International escapes", tiles: catalog.tiles.international, domestic: false },
  ].filter((row) => row.tiles.length > 0);

  return (
    <div className="flex flex-col gap-10">
      {rows.map((row) => (
        <nav key={row.title} aria-label={row.title} className="space-y-5">
          <SectionTitle eyebrow={row.eyebrow} title={row.title} />
          <ul className={gridClass}>
            {row.tiles.map((tile) => (
              <li key={tile.slug}>
                <DestinationCard tile={tile} domestic={row.domestic} />
              </li>
            ))}
          </ul>
        </nav>
      ))}

      {catalog.categories.length > 0 && (
        <nav aria-label="Browse by type of trip" className="space-y-5">
          <SectionTitle eyebrow="Travel your way" title="Pick a type of trip" />
          <ul className="flex flex-wrap gap-3">
            {catalog.categories.map((c) => {
              const Icon = CATEGORY_ICONS[c.slug] ?? Compass;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="group inline-flex items-center gap-2.5 rounded-full border border-brand-blue-900/15 bg-white py-2 pl-2 pr-5 text-sm font-semibold text-brand-ink-900 transition-all hover:border-brand-blue-700 hover:shadow-[0_8px_20px_rgb(var(--brand-blue-rgb)/0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue-700/10 text-brand-blue-700 transition-colors group-hover:bg-brand-blue-700 group-hover:text-white">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {c.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}

/** A stable id for a region heading, used by in-page links. */
export function anchorFor(regionKey: string) {
  return regionKey
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { Phone, Mail, MapPin } from "lucide-react";
import { getCachedSettings } from "@/services/settings-service";
import { CatalogService } from "@/services/catalog-service";
import SocialLink, { type SocialKey } from "@/components/SocialIcons";

const QUICK_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/packages", label: "Travel Packages" },
  { href: "/reviews", label: "Traveller Reviews" },
  { href: "/vehicle-booking", label: "Vehicle Booking" },
  { href: "/contact", label: "Contact Us" },
];

// Each service points at the page where it can actually be requested.
const SERVICES = [
  { label: "Custom Tour Packages", href: "/contact?service=custom-packages" },
  { label: "Cab Booking (One Way / Round Trip)", href: "/vehicle-booking" },
  { label: "Airport & Railway Transfers", href: "/vehicle-booking" },
  { label: "Tempo Traveller Hire", href: "/vehicle-booking" },
  { label: "Mini Bus & Bus Booking", href: "/vehicle-booking" },
  { label: "Corporate Travel", href: "/contact?service=custom-packages" },
];

const POPULAR_DESTINATIONS = 8;

const linkClass =
  "text-sm text-brand-mist-200/80 hover:text-brand-lime-400 transition-colors";

export default async function Footer() {
  const [settings, catalog] = await Promise.all([
    getCachedSettings(),
    // The footer is on every page, so a failure here must never break them.
    CatalogService.getCatalog().catch(() => null),
  ]);
  const year = new Date().getFullYear();

  // The places with the most live packages, then every trip type in use.
  const popularDestinations = catalog
    ? [...catalog.tiles.domestic, ...catalog.tiles.international]
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .slice(0, POPULAR_DESTINATIONS)
    : [];
  const tripTypes = catalog?.categories ?? [];

  const socials = [
    { kind: "instagram", label: "Instagram", url: settings?.instagramUrl },
    { kind: "facebook", label: "Facebook", url: settings?.facebookUrl },
    { kind: "youtube", label: "YouTube", url: settings?.youtubeUrl },
    { kind: "google", label: "Google Business Profile", url: settings?.googleBusinessUrl },
  ].filter(
    (s): s is { kind: SocialKey; label: string; url: string } => Boolean(s.url),
  );
  const waUrl = `https://wa.me/${settings?.whatsappNumber ?? ""}?text=Hi%2C%20I%27d%20like%20to%20inquire%20about%20your%20travel%20services.`;

  return (
    <footer className="bg-brand-blue-900 text-brand-mist-200 mt-16">
      <div className="travel-shell py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 inline-flex">
              <BrandLogo variant="white" size="lg" className="h-16 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-brand-mist-200/80">
              {settings?.footerTagline ?? ""}
            </p>
            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-700"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>

            {socials.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-cream-100">
                  Follow us
                </p>
                <ul className="flex flex-wrap gap-3">
                  {socials.map((s) => (
                    <li key={s.kind}>
                      <SocialLink kind={s.kind} label={s.label} href={s.url} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-cream-100">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-cream-100">
              Services
            </h3>
            <ul className="flex flex-col gap-2">
              {SERVICES.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className={linkClass}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-cream-100">
              Contact
            </h3>
            <address className="not-italic flex flex-col gap-3 text-sm text-brand-mist-200/80">
              <a
                href={`tel:${settings?.phone ?? ""}`}
                className="flex items-start gap-2 hover:text-brand-lime-400 transition-colors"
              >
                <Phone size={14} className="mt-0.5 shrink-0" aria-hidden />
                {settings?.phone ?? ""}
              </a>
              <a
                href={`mailto:${settings?.email ?? ""}`}
                className="flex items-start gap-2 hover:text-brand-lime-400 transition-colors"
              >
                <Mail size={14} className="mt-0.5 shrink-0" aria-hidden />
                {settings?.email ?? ""}
              </a>
              <span className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden />
                <span>{settings?.address ?? ""}</span>
              </span>
            </address>
          </div>
        </div>

        {(popularDestinations.length > 0 || tripTypes.length > 0) && (
          <div className="mt-10 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-2">
            {popularDestinations.length > 0 && (
              <nav aria-label="Popular destinations">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-cream-100">
                  Popular Destinations
                </h3>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {popularDestinations.map((d) => (
                    <li key={d.slug}>
                      <Link href={`/destinations/${d.slug}`} className={linkClass}>
                        {d.name} Tour Packages
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {tripTypes.length > 0 && (
              <nav aria-label="Trip types">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-cream-100">
                  Trip Types
                </h3>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {tripTypes.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/categories/${c.slug}`} className={linkClass}>
                        {c.name} Tour Packages
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        )}

        <hr className="my-8 border-white/10" />
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-brand-mist-200/50 sm:flex-row">
          <p>
            © {year} Umiya Tours & Travels (OPC) Pvt. Ltd. All rights reserved.
          </p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy-policy" className="hover:text-brand-lime-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-brand-lime-400 transition-colors">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

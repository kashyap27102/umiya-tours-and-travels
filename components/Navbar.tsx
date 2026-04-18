"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import BrandLogo from "@/components/BrandLogo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "sticky top-0 z-50 w-full transition-all " +
        (scrolled
          ? "bg-white/92 shadow-[0_2px_12px_rgb(var(--brand-blue-rgb)/0.10)] backdrop-blur"
          : "bg-transparent")
      }
    >
      <div className="travel-shell flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0" aria-label="Umiya Tours home">
          <BrandLogo
            size="md"
            className="h-11 w-auto"
            priority
            variant="white"
          />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-brand-ink-900 hover:text-brand-blue-700 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="primary"
            size="sm"
            className="hidden md:inline-flex"
          >
            <Link href="/cab-booking">Book Now</Link>
          </Button>

          {/* Mobile hamburger */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((p) => !p)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl text-brand-ink-900 hover:bg-brand-mist-200 transition"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <nav
        id="mobile-menu"
        aria-label="Mobile navigation"
        className={
          "md:hidden overflow-hidden transition-all duration-200 " +
          (open ? "max-h-96 border-t border-brand-blue-900/10" : "max-h-0")
        }
      >
        <ul className="flex flex-col py-2 bg-white/95 backdrop-blur">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="block px-6 py-3 text-sm font-medium text-brand-ink-900 hover:bg-brand-mist-200 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="px-6 pt-2 pb-4">
            <Button asChild variant="primary" size="md" className="w-full">
              <Link href="/cab-booking" onClick={() => setOpen(false)}>
                Book Now
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

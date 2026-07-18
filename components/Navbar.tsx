"use client";

import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import * as React from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header
      className={
        "z-50 w-full transition-all shadow-sm " +
        (open ? "bg-white/95 backdrop-blur" : "bg-white")
      }
    >
      <div className="travel-shell flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0" aria-label="Umiya Tours home">
          <BrandLogo size="md" className="h-20 w-auto" priority />
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
            <Link href="/vehicle-booking">Book Now</Link>
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
              <X size={20} aria-hidden />
            ) : (
              <Menu size={20} aria-hidden />
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
              <Link href="/vehicle-booking" onClick={() => setOpen(false)}>
                Book Now
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

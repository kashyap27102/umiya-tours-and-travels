import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";

interface HeroBannerProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Fully qualified or relative image src */
  imageSrc?: string;
  imageAlt?: string;
}

export default function HeroBanner({
  eyebrow = "Umiya Tours & Travels",
  heading,
  subheading,
  primaryCta = { label: "Explore Packages", href: "/packages" },
  secondaryCta = { label: "Book Now", href: "/cab-booking" },
  imageSrc,
  imageAlt = "Travel destination",
}: HeroBannerProps) {
  return (
    <section className="brand-hero relative overflow-hidden rounded-3xl shadow-xl">
      {/* Background image overlay */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover opacity-25 mix-blend-luminosity"
        />
      )}

      {/* Glow accents */}
      <div className="brand-hero-glow absolute inset-y-0 right-0 w-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 travel-shell py-16 md:py-24 lg:py-32">
        <div className="max-w-2xl">
          {eyebrow && (
            <Badge
              variant="solid"
              size="md"
              className="mb-5 uppercase tracking-wider"
            >
              {eyebrow}
            </Badge>
          )}

          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {heading}
          </h1>

          {subheading && (
            <p className="mt-5 max-w-xl text-base text-brand-mist-200 md:text-lg">
              {subheading}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="primary" size="lg">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            <Button asChild variant="hero-outline" size="lg">
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

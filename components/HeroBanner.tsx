import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";

interface HeroBannerProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  primaryCta?: { label: string; href: string };
  /** Fully qualified or relative image src */
  imageSrc?: string;
  imageAlt?: string;
}

export default function HeroBanner({
  eyebrow = "Umiya Tours & Travels",
  heading,
  subheading,
  primaryCta = { label: "Explore Packages", href: "/packages" },
  imageSrc,
  imageAlt = "Travel destination",
}: HeroBannerProps) {
  return (
    <section className="brand-hero relative overflow-hidden shadow-xl">
      {/* Background image overlay */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover opacity-35 mix-blend-luminosity scale-105"
        />
      )}

      {/* Glow accents */}
      <div className="brand-hero-glow absolute inset-y-0 right-0 w-1/2 pointer-events-none" />
      <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-brand-lime-400/20 blur-3xl motion-float-slow" />
      <div className="pointer-events-none absolute -right-10 bottom-8 h-52 w-52 rounded-full bg-brand-blue-500/30 blur-3xl motion-float-medium" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 travel-shell py-16 md:py-24 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
          <div className="max-w-2xl motion-fade-up">
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
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-3 backdrop-blur-md motion-float-medium">
              <Image
                src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1000&q=80"
                alt="Aerial tropical island"
                width={1000}
                height={900}
                className="h-90 w-full rounded-2xl object-cover"
              />
            </div>

            <div className="absolute -left-10 bottom-8 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-md motion-float-slow">
              <Image
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=700&q=80"
                alt="Friends enjoying a journey"
                width={280}
                height={200}
                className="h-28 w-44 rounded-xl object-cover"
              />
            </div>

            <div className="absolute -right-8 top-8 rounded-full border border-white/20 bg-brand-lime-400 px-5 py-2 text-sm font-semibold text-brand-blue-900 motion-float-slow">
              50+ Destinations
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import HeroSlideshow, { type HeroSlideshowImage } from "@/components/HeroSlideshow";

interface HeroBannerProps {
  heading: string;
  subheading?: string;
  /** Background photos that auto-rotate; single-item arrays render statically */
  images?: HeroSlideshowImage[];
}

export default function HeroBanner({
  heading,
  subheading,
  images,
}: HeroBannerProps) {
  return (
    <section className="brand-hero relative overflow-hidden shadow-xl">
      {/* Background image slideshow */}
      {images && images.length > 0 && <HeroSlideshow images={images} />}

      {/* Overlay for text legibility, fading out over the rest of the photo */}
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/35 to-transparent pointer-events-none" />

      {/* Glow accents */}
      <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-brand-lime-400/20 blur-3xl motion-float-slow" />
      <div className="pointer-events-none absolute -right-10 bottom-8 h-52 w-52 rounded-full bg-brand-blue-500/30 blur-3xl motion-float-medium" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 travel-shell py-20 md:py-28 lg:py-36">
        <div className="max-w-2xl motion-fade-up">
          <h1 className="whitespace-pre-line text-3xl font-bold leading-snug md:text-4xl lg:text-5xl">
            {heading}
          </h1>

          {subheading && (
            <p className="mt-5 max-w-xl text-base text-brand-mist-200 md:text-lg">
              {subheading}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

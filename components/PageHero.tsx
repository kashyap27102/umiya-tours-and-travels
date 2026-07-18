import { Badge, cn } from "@/components/ui";

type PageHeroProps = {
  heading: string;
  description?: string;
  badge?: string;
  className?: string;
};

export default function PageHero({
  heading,
  description,
  badge,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "brand-hero relative overflow-hidden px-6 py-10 md:px-10 md:py-12",
        className,
      )}
    >
      <div className="brand-hero-glow pointer-events-none absolute inset-0" />
      <div className="relative travel-shell max-w-3xl">
        {badge && (
          <Badge variant="solid" size="md" className="mb-4">
            {badge}
          </Badge>
        )}
        <h1 className="text-4xl font-bold text-brand-cream-100 md:text-5xl">
          {heading}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base text-brand-mist-200 md:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

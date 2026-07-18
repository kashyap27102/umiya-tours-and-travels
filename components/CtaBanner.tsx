import Image from "next/image";
import Link from "next/link";
import { Button, cn } from "@/components/ui";
import BrandLogo from "@/components/BrandLogo";
import type { ButtonProps } from "@/components/ui";

type CtaBannerAction = {
  label: string;
  href: string;
  variant?: ButtonProps["variant"];
};

type CtaBannerProps = {
  heading: string;
  description: string;
  actions: CtaBannerAction[];
  backgroundImage?: { src: string; alt: string };
  showLogo?: boolean;
  className?: string;
};

export default function CtaBanner({
  heading,
  description,
  actions,
  backgroundImage,
  showLogo = false,
  className,
}: CtaBannerProps) {
  return (
    <div
      className={cn(
        "brand-hero relative overflow-hidden rounded-3xl px-8 py-14 text-center md:px-12",
        className,
      )}
    >
      {backgroundImage && (
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover opacity-20"
        />
      )}
      <div className="brand-hero-glow pointer-events-none absolute inset-0" />
      {showLogo && (
        <BrandLogo
          variant="white"
          size="lg"
          decorative
          className="pointer-events-none absolute right-4 top-4 h-10 w-auto opacity-60 md:right-6 md:top-6 md:h-14"
        />
      )}
      <h2 className="relative text-3xl font-bold text-brand-cream-100 md:text-4xl">
        {heading}
      </h2>
      <p className="relative mt-3 text-base text-brand-mist-200 md:text-lg">
        {description}
      </p>
      <div className="relative mt-8 flex flex-wrap justify-center gap-4">
        {actions.map((action) => (
          <Button
            key={action.label}
            asChild
            variant={action.variant ?? "primary"}
            size="lg"
          >
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

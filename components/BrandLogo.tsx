import Image from "next/image";
import { BRAND_LOGO, SITE_NAME } from "@/lib/constants";
import { cn } from "@/components/ui";

type BrandLogoProps = {
  variant?: "color" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
  decorative?: boolean;
};

const sizeMap = {
  sm: { width: 108, height: 85 },
  md: { width: 136, height: 107 },
  lg: { width: 176, height: 138 },
} as const;

export default function BrandLogo({
  variant = "color",
  size = "md",
  className,
  priority = false,
  decorative = false,
}: BrandLogoProps) {
  const dimensions = sizeMap[size];
  const isWhite = variant === "white";

  return (
    <Image
      src={isWhite ? BRAND_LOGO.white : BRAND_LOGO.color}
      alt={decorative ? "" : SITE_NAME}
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      aria-hidden={decorative}
      className={cn(
        "object-contain",
        isWhite && "drop-shadow-[0_0_8px_rgb(255_255_255/0.32)]",
        className,
      )}
    />
  );
}

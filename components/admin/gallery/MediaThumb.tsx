import { cn } from "@/components/ui/cn";

interface MediaThumbProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Plain thumbnail for admin screens. Library images come from a handful of
 * allowed hosts, and thumbnails are small, so the optimising image component
 * isn't needed here.
 */
export function MediaThumb({ src, alt, className }: Readonly<MediaThumbProps>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

import Image from "next/image";
import { cn } from "@/components/ui/cn";

const MAX_VISIBLE_IMAGES = 5;

type PackageGalleryProps = {
  images: string[];
  alt: string;
  className?: string;
};

type TileProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  overlayCount?: number;
};

function Tile({
  src,
  alt,
  sizes,
  priority,
  className,
  overlayCount = 0,
}: Readonly<TileProps>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-brand-blue-900/10 bg-white",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
      {overlayCount > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-ink-900/55 text-lg font-semibold text-brand-cream-100">
          +{overlayCount} more
        </div>
      )}
    </div>
  );
}

/** Adaptive photo gallery: 1 image goes full-bleed, 2-5 images arrange into a big-tile-plus-thumbnails grid. Anything past 5 collapses into a "+N more" overlay on the last tile. */
export default function PackageGallery({
  images,
  alt,
  className,
}: Readonly<PackageGalleryProps>) {
  const visibleImages = images.slice(0, MAX_VISIBLE_IMAGES);
  const remainingCount = images.length - visibleImages.length;
  const count = visibleImages.length;

  if (count === 0) {
    return null;
  }

  if (count === 1) {
    return (
      <div
        className={cn(
          "relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-brand-blue-900/10 bg-white shadow-[0_16px_40px_rgb(var(--brand-blue-rgb)/0.14)] md:aspect-[21/9]",
          className,
        )}
      >
        <Image
          src={visibleImages[0]}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    );
  }

  const bigSizes =
    count >= 4
      ? "(max-width: 768px) 100vw, 60vw"
      : "(max-width: 768px) 100vw, 50vw";
  const smallSizes =
    count >= 4
      ? "(max-width: 768px) 50vw, 20vw"
      : "(max-width: 768px) 100vw, 50vw";

  return (
    <div
      className={cn(
        "grid h-80 w-full gap-2 md:h-112 md:gap-3",
        count === 2 && "grid-cols-2",
        count === 3 && "grid-cols-2 grid-rows-2",
        count === 4 && "grid-cols-[2fr_1fr] grid-rows-3",
        count === 5 && "grid-cols-[2fr_1fr] grid-rows-2",
        className,
      )}
    >
      <Tile
        src={visibleImages[0]}
        alt={`${alt} photo 1`}
        sizes={bigSizes}
        priority
        className={cn(
          count === 3 && "col-start-1 row-span-2",
          count === 4 && "col-start-1 row-span-3",
          count === 5 && "col-start-1 row-span-2",
        )}
      />

      {count === 5 ? (
        <div className="row-span-2 grid grid-cols-2 grid-rows-2 gap-2 md:gap-3">
          {visibleImages.slice(1).map((src, i) => (
            <Tile
              key={src}
              src={src}
              alt={`${alt} photo ${i + 2}`}
              sizes={smallSizes}
              overlayCount={i === 3 ? remainingCount : 0}
            />
          ))}
        </div>
      ) : (
        visibleImages
          .slice(1)
          .map((src, i) => (
            <Tile
              key={src}
              src={src}
              alt={`${alt} photo ${i + 2}`}
              sizes={smallSizes}
            />
          ))
      )}
    </div>
  );
}

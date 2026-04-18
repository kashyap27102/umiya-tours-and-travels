"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";

export type CarouselItem = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type ImageCarouselProps = {
  items: CarouselItem[];
  className?: string;
  aspectClassName?: string;
  showIndicators?: boolean;
};

export default function ImageCarousel({
  items,
  className,
  aspectClassName = "aspect-[16/9]",
  showIndicators = true,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = items.length;
  const hasItems = total > 0;

  const activeItem = useMemo(() => {
    if (!hasItems) {
      return null;
    }

    return items[activeIndex] ?? items[0];
  }, [activeIndex, hasItems, items]);

  const goPrev = () => {
    if (!hasItems) {
      return;
    }

    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = () => {
    if (!hasItems) {
      return;
    }

    setActiveIndex((prev) => (prev + 1) % total);
  };

  if (!activeItem) {
    return (
      <Card variant="default" padding="md" className={className}>
        <p className="text-sm text-brand-muted-600">
          No images available for carousel.
        </p>
      </Card>
    );
  }

  return (
    <div className={cn("relative mx-auto w-full max-w-4xl", className)}>
      <Card variant="elevated" padding="none" className="overflow-hidden">
        <div className={cn("relative w-full", aspectClassName)}>
          <Image
            src={activeItem.imageSrc}
            alt={activeItem.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
            priority={activeIndex === 0}
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-ink-900/75 via-brand-ink-900/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
            <CardTitle className="text-xl text-brand-cream-100 md:text-2xl">
              {activeItem.title}
            </CardTitle>
            {activeItem.subtitle && (
              <CardBody className="mt-1 text-xs uppercase tracking-wide text-brand-cream-100/80 md:text-sm">
                {activeItem.subtitle}
              </CardBody>
            )}
            {activeItem.description && (
              <CardBody className="mt-2 max-w-2xl text-brand-cream-100/90">
                {activeItem.description}
              </CardBody>
            )}

            {activeItem.ctaLabel && activeItem.ctaHref && (
              <div className="mt-4">
                <Button
                  asChild
                  variant="primary"
                  size="sm"
                  className="pointer-events-auto"
                >
                  <Link href={activeItem.ctaHref}>{activeItem.ctaLabel}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Button
        type="button"
        variant="solid"
        size="sm"
        aria-label="Previous slide"
        onClick={goPrev}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full px-3 py-2 md:left-3"
      >
        <span aria-hidden>‹</span>
      </Button>

      <Button
        type="button"
        variant="solid"
        size="sm"
        aria-label="Next slide"
        onClick={goNext}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full px-3 py-2 md:right-3"
      >
        <span aria-hidden>›</span>
      </Button>

      {showIndicators && total > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all",
                index === activeIndex
                  ? "w-7 bg-brand-blue-700"
                  : "bg-brand-blue-900/30 hover:bg-brand-blue-700/55",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

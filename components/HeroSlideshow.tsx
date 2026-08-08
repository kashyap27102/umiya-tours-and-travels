"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface HeroSlideshowImage {
  src: string;
  alt: string;
  /** CSS object-position value to control which part of the photo stays in frame (default: "center") */
  focalPoint?: string;
}

interface HeroSlideshowProps {
  images: HeroSlideshowImage[];
  intervalMs?: number;
}

export default function HeroSlideshow({
  images,
  intervalMs = 5000,
}: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <>
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, 1200px"
          style={{ objectPosition: image.focalPoint ?? "center" }}
          className={`absolute inset-0 object-cover scale-105 transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}

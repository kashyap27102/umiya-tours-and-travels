"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardBody, Modal } from "@/components/ui";
import { ArrowRight, MapPin, Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  location?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  review: string;
  initials?: string;
  /** A photo of the customer or their trip. */
  image?: { url: string; alt: string } | null;
  /** Where they travelled. */
  destination?: string | null;
  /** A live package to link to. */
  packageLink?: { slug: string; name: string } | null;
}

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <span className="flex gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < count ? "currentColor" : "none"}
          strokeWidth={i < count ? 0 : 1.5}
          aria-hidden
          className={
            i < count ? "text-brand-lime-400" : "text-brand-muted-600/40"
          }
        />
      ))}
    </span>
  );
}

function DestinationChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-blue-700/10 px-2.5 py-1 text-xs font-semibold text-brand-blue-700">
      <MapPin size={12} aria-hidden />
      {name}
    </span>
  );
}

function PackageLink({ pkg }: { pkg: { slug: string; name: string } }) {
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue-700! hover:underline"
    >
      View {pkg.name}
      <ArrowRight size={12} aria-hidden />
    </Link>
  );
}

function Author({
  name,
  location,
  avatarInitials,
}: {
  name: string;
  location?: string;
  avatarInitials: string;
}) {
  return (
    <div className="flex items-center gap-3 border-t border-brand-blue-900/[0.07] pt-2">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue-700/12 text-xs font-bold text-brand-blue-700"
        aria-hidden
      >
        {avatarInitials}
      </div>
      <div>
        <p className="text-sm font-semibold text-brand-ink-900">{name}</p>
        {location && <p className="text-xs text-brand-muted-600">{location}</p>}
      </div>
    </div>
  );
}

export default function TestimonialCard({
  name,
  location,
  rating = 5,
  review,
  initials,
  image,
  destination,
  packageLink,
}: TestimonialCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  // "See more" only appears when the text is actually cut off, not just long.
  const [isTruncated, setIsTruncated] = useState(false);
  const measureReview = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const observer = new ResizeObserver(() =>
      setIsTruncated(el.scrollHeight - el.clientHeight > 1),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const avatarInitials =
    initials ??
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <>
      <Card
        variant="elevated"
        padding="none"
        className="flex h-full flex-col overflow-hidden"
      >
        {image && (
          <div className="relative h-44 w-full shrink-0 bg-brand-mist-200/50">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(min-width: 640px) 320px, 288px"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <Stars count={rating} size={20} />

          {destination && (
            <div>
              <DestinationChip name={destination} />
            </div>
          )}

          <CardBody className="flex-1 italic">
            {/* A photo uses up room, so a card without one can show more text. */}
            <span
              ref={measureReview}
              className={image ? "line-clamp-4" : "line-clamp-9"}
            >
              &ldquo;{review}&rdquo;
            </span>
            {isTruncated && (
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="mt-1.5 block text-xs font-semibold not-italic text-brand-blue-700 hover:text-brand-blue-900 hover:underline"
              >
                See more
              </button>
            )}
          </CardBody>

          <Author
            name={name}
            location={location}
            avatarInitials={avatarInitials}
          />

          {packageLink && <PackageLink pkg={packageLink} />}
        </div>
      </Card>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={name}
        size="sm"
      >
        <div className="flex flex-col gap-4">
          {image && (
            <div className="relative h-52 w-full overflow-hidden rounded-xl bg-brand-mist-200/50">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(min-width: 640px) 448px, 90vw"
                className="object-cover"
              />
            </div>
          )}
          <Stars count={rating} size={20} />
          {destination && (
            <div>
              <DestinationChip name={destination} />
            </div>
          )}
          <p className="italic text-brand-ink-700">&ldquo;{review}&rdquo;</p>
          <Author
            name={name}
            location={location}
            avatarInitials={avatarInitials}
          />
          {packageLink && <PackageLink pkg={packageLink} />}
        </div>
      </Modal>
    </>
  );
}

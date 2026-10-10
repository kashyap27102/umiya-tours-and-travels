import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Package as PackageIcon, Star } from "lucide-react";
import type { PublicTestimonial } from "@/services/testimonial-service";

export function StarRow({ count, size = 16 }: Readonly<{ count: number; size?: number }>) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          aria-hidden
          fill={i < count ? "currentColor" : "none"}
          strokeWidth={i < count ? 0 : 1.5}
          className={i < count ? "text-brand-lime-400" : "text-brand-muted-600/35"}
        />
      ))}
    </span>
  );
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** A full review (never truncated), for the public reviews page. */
export default function ReviewCard({ review }: Readonly<{ review: PublicTestimonial }>) {
  return (
    <article className="mb-6 break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-[0_12px_32px_rgb(var(--brand-blue-rgb)/0.10)] transition-shadow hover:shadow-[0_18px_44px_rgb(var(--brand-blue-rgb)/0.16)]">
      {review.image && (
        <div className="relative aspect-4/3 w-full bg-brand-mist-200/50">
          <Image
            src={review.image.url}
            alt={review.image.alt}
            fill
            sizes="(min-width: 1280px) 384px, (min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="space-y-4 p-6">
        <StarRow count={review.rating} size={18} />

        <blockquote className="relative">
          <span
            aria-hidden
            className="absolute -left-1 -top-5 select-none font-serif text-6xl leading-none text-brand-lime-400/50"
          >
            &ldquo;
          </span>
          <p className="relative whitespace-pre-line pt-2 text-[15px] leading-relaxed text-brand-ink-700">
            {review.review}
          </p>
        </blockquote>

        {(review.destinationName || review.packageName) && (
          <dl className="space-y-2 rounded-2xl bg-brand-mist-200/50 px-4 py-3 text-sm">
            {review.destinationName && (
              <div className="flex items-start gap-2.5">
                <MapPin
                  size={16}
                  aria-hidden
                  className="mt-0.5 shrink-0 text-brand-blue-700"
                />
                <div>
                  <dt className="text-xs text-brand-muted-600">Travelled to</dt>
                  <dd className="font-semibold text-brand-ink-900">
                    {review.destinationName}
                  </dd>
                </div>
              </div>
            )}
            {review.packageName && (
              <div className="flex items-start gap-2.5">
                <PackageIcon
                  size={16}
                  aria-hidden
                  className="mt-0.5 shrink-0 text-brand-blue-700"
                />
                <div className="min-w-0">
                  <dt className="text-xs text-brand-muted-600">Package</dt>
                  <dd className="font-semibold text-brand-ink-900">
                    {review.packageLink ? (
                      <Link
                        href={`/packages/${review.packageLink.slug}`}
                        className="inline-flex items-center gap-1 text-brand-blue-700! hover:underline"
                      >
                        {review.packageName}
                        <ArrowRight size={14} aria-hidden />
                      </Link>
                    ) : (
                      review.packageName
                    )}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        )}

        <footer className="flex items-center gap-3 border-t border-brand-blue-900/[0.07] pt-4">
          <div
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue-700/12 text-xs font-bold text-brand-blue-700"
          >
            {initialsOf(review.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-brand-ink-900">
              {review.name}
            </p>
            <p className="truncate text-xs text-brand-muted-600">
              {review.location}
            </p>
          </div>
        </footer>

      </div>
    </article>
  );
}

"use client";

import { useState } from "react";
import { Card, CardBody, Modal } from "@/components/ui";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  location?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  review: string;
  initials?: string;
}

const REVIEW_TRUNCATE_LENGTH = 150;

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

export default function TestimonialCard({
  name,
  location,
  rating = 5,
  review,
  initials,
}: TestimonialCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const avatarInitials =
    initials ??
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const isTruncated = review.length > REVIEW_TRUNCATE_LENGTH;

  return (
    <>
      <Card
        variant="elevated"
        padding="md"
        className="flex h-full flex-col gap-4"
      >
        {/* Stars */}
        <Stars count={rating} size={20} />

        {/* Review */}
        <CardBody className="flex-1 italic">
          <span className="line-clamp-4">&ldquo;{review}&rdquo;</span>
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

        {/* Author */}
        <div className="flex items-center gap-3 pt-2 border-t border-brand-blue-900/[0.07]">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue-700/12 text-brand-blue-700 text-xs font-bold"
            aria-hidden
          >
            {avatarInitials}
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-ink-900">{name}</p>
            {location && (
              <p className="text-xs text-brand-muted-600">{location}</p>
            )}
          </div>
        </div>
      </Card>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={name}
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <Stars count={rating} size={20} />
          <p className="italic text-brand-ink-700">&ldquo;{review}&rdquo;</p>
          <div className="flex items-center gap-3 pt-2 border-t border-brand-blue-900/[0.07]">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue-700/12 text-brand-blue-700 text-xs font-bold"
              aria-hidden
            >
              {avatarInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-ink-900">
                {name}
              </p>
              {location && (
                <p className="text-xs text-brand-muted-600">{location}</p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

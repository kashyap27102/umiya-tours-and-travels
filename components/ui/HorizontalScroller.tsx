"use client";

import * as React from "react";
import SectionHeading from "@/components/SectionHeading";
import { cn } from "@/components/ui/cn";

export interface HorizontalScrollerProps {
  children: React.ReactNode;
  /** Applied to the scrollable track (e.g. gap, padding overrides) */
  className?: string;
  /** Used to build the prev/next button aria-labels, e.g. "destinations" */
  itemLabel?: string;
  eyebrow?: string;
  title: string;
}

export default function HorizontalScroller({
  children,
  className,
  itemLabel = "items",
  eyebrow,
  title,
}: HorizontalScrollerProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <SectionHeading eyebrow={eyebrow} title={title} className="mb-0" />

        <div className="hidden shrink-0 gap-2 lg:flex">
          <button
            type="button"
            aria-label={`Scroll to previous ${itemLabel}`}
            onClick={() => scrollByCards(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-blue-700 bg-brand-blue-700 text-lg font-bold text-white shadow-md transition-colors hover:bg-brand-blue-900"
          >
            <span aria-hidden>‹</span>
          </button>

          <button
            type="button"
            aria-label={`Scroll to next ${itemLabel}`}
            onClick={() => scrollByCards(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-blue-700 bg-brand-blue-700 text-lg font-bold text-white shadow-md transition-colors hover:bg-brand-blue-900"
          >
            <span aria-hidden>›</span>
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className={cn(
          "scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-2 py-4",
          className,
        )}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}

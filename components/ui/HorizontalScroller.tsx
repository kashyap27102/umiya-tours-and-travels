"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

export interface HorizontalScrollerProps {
  children: React.ReactNode;
  /** Applied to the scrollable track (e.g. gap, padding overrides) */
  className?: string;
  /** Used to build the prev/next button aria-labels, e.g. "destinations" */
  itemLabel?: string;
}

export default function HorizontalScroller({
  children,
  className,
  itemLabel = "items",
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
    <div className="group relative">
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

      <Button
        type="button"
        variant="solid"
        size="md"
        aria-label={`Scroll to previous ${itemLabel}`}
        onClick={() => scrollByCards(-1)}
        className="absolute left-0 top-1/2 hidden -translate-y-1/2 rounded-full px-4 py-3 transition-all duration-300 hover:bg-brand-blue-900 lg:flex"
      >
        <span aria-hidden className="text-lg font-bold">
          ‹
        </span>
      </Button>

      <Button
        type="button"
        variant="solid"
        size="md"
        aria-label={`Scroll to next ${itemLabel}`}
        onClick={() => scrollByCards(1)}
        className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-full px-4 py-3 transition-all duration-300 hover:bg-brand-blue-900 lg:flex"
      >
        <span aria-hidden className="text-lg font-bold">
          ›
        </span>
      </Button>
    </div>
  );
}

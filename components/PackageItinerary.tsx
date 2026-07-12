"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge, Button, Card, CardTitle } from "@/components/ui";
import { cn } from "@/components/ui/cn";

type ItineraryItem = {
  day: number;
  title: string;
  description: string;
};

interface PackageItineraryProps {
  itinerary: ItineraryItem[];
}

export default function PackageItinerary({
  itinerary,
}: Readonly<PackageItineraryProps>) {
  const [openDays, setOpenDays] = useState<Set<number>>(
    () => new Set(itinerary[0] ? [itinerary[0].day] : []),
  );

  const allExpanded = openDays.size === itinerary.length;

  const toggleDay = (day: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setOpenDays(
      allExpanded ? new Set() : new Set(itinerary.map((item) => item.day)),
    );
  };

  return (
    <Card variant="elevated" padding="lg" className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <CardTitle>Day-Wise Itinerary</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={toggleAll}>
          {allExpanded ? "Collapse All" : "Expand All"}
        </Button>
      </div>

      <div className="space-y-3">
        {itinerary.map((item) => {
          const isOpen = openDays.has(item.day);

          return (
            <div
              key={item.day}
              className={cn(
                "overflow-hidden rounded-2xl border bg-white/80 transition-colors",
                isOpen
                  ? "border-brand-blue-700/30 bg-white shadow-[0_8px_24px_rgb(var(--brand-blue-rgb)/0.10)]"
                  : "border-brand-blue-900/10",
              )}
            >
              <button
                type="button"
                onClick={() => toggleDay(item.day)}
                aria-expanded={isOpen}
                aria-controls={`itinerary-day-${item.day}`}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Badge variant="brand" size="sm" className="shrink-0">
                    Day {item.day}
                  </Badge>
                  <h3 className="truncate text-lg font-semibold text-brand-ink-900">
                    {item.title}
                  </h3>
                </div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-brand-muted-600 transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              <div
                id={`itinerary-day-${item.day}`}
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 text-sm text-brand-muted-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

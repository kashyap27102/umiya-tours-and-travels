"use client";

import { cn } from "@/components/ui/cn";

interface TabButtonsProps<T extends string> {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

/** Small segmented switch used inside dialogs. */
export function TabButtons<T extends string>({
  tabs,
  value,
  onChange,
}: Readonly<TabButtonsProps<T>>) {
  return (
    <div
      role="tablist"
      className="inline-flex rounded-xl border border-brand-blue-900/15 bg-brand-mist-200/50 p-1"
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "cursor-pointer rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
              active
                ? "bg-white text-brand-blue-900 shadow-sm"
                : "text-brand-muted-600 hover:text-brand-ink-900",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

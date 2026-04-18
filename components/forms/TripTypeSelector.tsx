"use client";

import { cn } from "@/components/ui";

interface TripTypeSelectorProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  label?: string;
  errorMessage?: string;
}

export default function TripTypeSelector<T extends string>({
  options,
  value,
  onChange,
  label = "Trip Type",
  errorMessage,
}: TripTypeSelectorProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
        {label}
      </p>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {options.map((option) => {
          const isActive = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={cn(
                "min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold transition",
                isActive
                  ? "border-brand-blue-700 bg-brand-blue-700 text-brand-cream-100"
                  : "border-brand-blue-900/20 bg-white text-brand-ink-900 hover:border-brand-blue-500",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
}

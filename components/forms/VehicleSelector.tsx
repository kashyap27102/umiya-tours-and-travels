"use client";

import { cn } from "@/components/ui";

interface VehicleOption {
  label: string;
  sublabel?: string;
}

interface VehicleSelectorProps {
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
  label?: string;
  descriptions?: Partial<Record<string, string>>;
  errorMessage?: string;
}

export default function VehicleSelector({
  options,
  value,
  onChange,
  label = "Vehicle Type",
  descriptions,
  errorMessage,
}: VehicleSelectorProps) {
  const mappedOptions: VehicleOption[] = options.map((option) => ({
    label: option,
    sublabel: descriptions?.[option],
  }));

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
        {label}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {mappedOptions.map((option) => {
          const isActive = option.label === value;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onChange(option.label)}
              className={cn(
                "rounded-2xl border p-4 text-left transition",
                isActive
                  ? "border-brand-blue-700 bg-brand-blue-700 text-brand-cream-100"
                  : "border-brand-blue-900/15 bg-white hover:border-brand-blue-500",
              )}
            >
              <p
                className={cn(
                  "text-sm font-semibold",
                  isActive ? "text-brand-cream-100" : "text-brand-ink-900",
                )}
              >
                {option.label}
              </p>
              {option.sublabel && (
                <p
                  className={cn(
                    "mt-1 text-xs",
                    isActive ? "text-brand-mist-200" : "text-brand-muted-600",
                  )}
                >
                  {option.sublabel}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
}

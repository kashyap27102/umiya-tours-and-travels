"use client";

import * as React from "react";
import { cn } from "./cn";
import type { SelectOption } from "./Select";

export interface MultiSelectProps {
  options: SelectOption[];
  /** Selected values, in the order they were picked. */
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  id?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options",
  searchPlaceholder = "Search…",
  disabled = false,
  error = false,
  errorMessage,
  id,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const generatedId = React.useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const labelFor = (v: string) => options.find((o) => o.value === v)?.label ?? v;

  const toggle = (optValue: string) => {
    onChange(
      value.includes(optValue)
        ? value.filter((v) => v !== optValue)
        : [...value, optValue],
    );
  };

  const filtered = query.trim()
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : options;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        id={triggerId}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          } else if (e.key === "Escape") {
            setOpen(false);
            setQuery("");
          }
        }}
        className={cn(
          "flex w-full min-h-11 cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all outline-none",
          error
            ? "border-red-400 bg-white text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-400/25"
            : "border-brand-blue-900/20 bg-white text-brand-ink-900 focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-500/20",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <div className="flex flex-1 flex-wrap gap-1.5">
          {value.length === 0 ? (
            <span className="px-1 text-brand-muted-600/70">{placeholder}</span>
          ) : (
            value.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 rounded-full bg-brand-blue-500/10 py-0.5 pl-2.5 pr-1 text-xs font-semibold text-brand-blue-900"
              >
                {labelFor(v)}
                <button
                  type="button"
                  aria-label={`Remove ${labelFor(v)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(v);
                  }}
                  className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-brand-blue-900/60 hover:bg-brand-blue-900/10 hover:text-brand-blue-900"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
        <span
          className={cn(
            "shrink-0 text-xs text-brand-muted-600 transition-transform duration-150",
            open && "rotate-180",
          )}
          aria-hidden
        >
          ▾
        </span>
      </div>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-brand-blue-900/10 bg-white shadow-lg">
          <div className="border-b border-brand-blue-900/10 p-2">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                  setQuery("");
                }
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-brand-blue-900/15 px-3 py-1.5 text-sm outline-none focus:border-brand-blue-500"
            />
          </div>
          <ul
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            aria-labelledby={triggerId}
            className="max-h-60 overflow-auto py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-2.5 text-sm text-brand-muted-600">
                No matches
              </li>
            ) : (
              filtered.map((opt) => {
                const selected = value.includes(opt.value);
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={selected}
                    onClick={() => toggle(opt.value)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm transition-colors",
                      selected
                        ? "bg-brand-blue-500/10 font-semibold text-brand-blue-900"
                        : "text-brand-ink-900 hover:bg-brand-mist-200/60",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] leading-none",
                        selected
                          ? "border-brand-blue-700 bg-brand-blue-700 text-white"
                          : "border-brand-blue-900/30",
                      )}
                      aria-hidden
                    >
                      {selected ? "✓" : ""}
                    </span>
                    <span className="truncate">{opt.label}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {errorMessage && (
        <p role="alert" className="mt-1 text-xs text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "./cn";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  id?: string;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  error = false,
  errorMessage,
  id,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const generatedId = React.useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedIndex = options.findIndex((opt) => opt.value === value);

  // Close on click outside
  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const select = (optValue: string) => {
    onChange(optValue);
    setOpen(false);
    setFocusedIndex(-1);
  };

  const handleToggle = () => {
    if (disabled) return;
    setOpen((prev) => {
      if (!prev) setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      return !prev;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && focusedIndex >= 0) {
          select(options[focusedIndex].value);
        } else {
          handleToggle();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
        } else {
          setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Escape":
        setOpen(false);
        setFocusedIndex(-1);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        id={triggerId}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex w-full min-h-11 items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-medium transition-all outline-none",
          error
            ? "border-red-400 bg-white text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-400/25"
            : "border-brand-blue-900/20 bg-white text-brand-ink-900 focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-500/20",
          !selectedOption && "text-brand-muted-600/70",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          className={cn(
            "ml-2 shrink-0 text-xs text-brand-muted-600 transition-transform duration-150",
            open && "rotate-180",
          )}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={triggerId}
          className="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-brand-blue-900/10 bg-white py-1 shadow-lg"
        >
          {options.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => select(opt.value)}
              className={cn(
                "cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors",
                i === focusedIndex && "bg-brand-mist-200",
                opt.value === value
                  ? "text-brand-blue-600"
                  : "text-brand-ink-900 hover:bg-brand-mist-200/60",
              )}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {errorMessage && (
        <p role="alert" className="mt-1 text-xs text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

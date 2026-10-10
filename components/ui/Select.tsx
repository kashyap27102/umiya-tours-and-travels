"use client";

import * as React from "react";
import { createPortal } from "react-dom";
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

/** Where the open list sits, in viewport coordinates. */
interface ListPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
}

const LIST_MAX_HEIGHT = 240;
const GAP = 6;

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
  const [position, setPosition] = React.useState<ListPosition | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const generatedId = React.useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedIndex = options.findIndex((opt) => opt.value === value);

  // The list is drawn on top of the page rather than inside the parent, so a
  // modal or scrolling panel can't clip it. It opens upward when the room
  // below is tight.
  const place = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - GAP - 8;
    const above = rect.top - GAP - 8;
    const openUp = below < 160 && above > below;
    setPosition(
      openUp
        ? {
            bottom: window.innerHeight - rect.top + GAP,
            left: rect.left,
            width: rect.width,
            maxHeight: Math.min(LIST_MAX_HEIGHT, above),
          }
        : {
            top: rect.bottom + GAP,
            left: rect.left,
            width: rect.width,
            maxHeight: Math.min(LIST_MAX_HEIGHT, below),
          },
    );
  }, []);

  // Close on click outside (the list lives outside the container now).
  React.useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  // Keep the list attached to the field while the page scrolls or resizes.
  React.useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  // Keep the keyboard-highlighted option in view.
  React.useEffect(() => {
    if (!open || focusedIndex < 0) return;
    listRef.current?.children[focusedIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, focusedIndex]);

  const openList = (startAt: number) => {
    place();
    setFocusedIndex(startAt);
    setOpen(true);
  };

  const select = (optValue: string) => {
    onChange(optValue);
    setOpen(false);
    setFocusedIndex(-1);
  };

  const handleToggle = () => {
    if (disabled) return;
    if (open) {
      setOpen(false);
    } else {
      openList(selectedIndex >= 0 ? selectedIndex : 0);
    }
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
          openList(selectedIndex >= 0 ? selectedIndex : 0);
        } else {
          setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Escape":
        // Don't let Escape also close a modal around this field.
        if (open) e.stopPropagation();
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
        ref={triggerRef}
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

      {open &&
        position &&
        createPortal(
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={triggerId}
            style={{
              position: "fixed",
              top: position.top,
              bottom: position.bottom,
              left: position.left,
              width: position.width,
              maxHeight: position.maxHeight,
            }}
            className="z-70 overflow-auto rounded-xl border border-brand-blue-900/10 bg-white py-1 shadow-lg"
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
          </ul>,
          document.body,
        )}

      {errorMessage && (
        <p role="alert" className="mt-1 text-xs text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

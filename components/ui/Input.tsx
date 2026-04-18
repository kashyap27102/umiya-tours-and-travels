"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/cn";

const inputVariants = cva(
  // Base — focus ring, sizing, font
  "w-full rounded-xl px-4 py-2.5 text-sm font-medium text-brand-ink-900 placeholder:text-brand-muted-600/70 transition-all outline-none focus:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /**
         * default — white background with brand border
         */
        default:
          "bg-white border border-brand-blue-900/20 focus:border-brand-blue-500 focus:ring-brand-blue-500/20",
        /**
         * filled — light mist background, no visible border at rest
         */
        filled:
          "bg-brand-mist-200 border border-transparent focus:border-brand-blue-500 focus:ring-brand-blue-500/20 focus:bg-white",
        /**
         * error — red accent ring; apply when field has a validation error
         */
        error:
          "bg-white border border-red-400 focus:border-red-500 focus:ring-red-400/25 text-red-900 placeholder:text-red-400/70",
      },
      inputSize: {
        sm: "min-h-9 text-xs px-3",
        md: "min-h-11",
        lg: "min-h-13 text-base px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  },
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  errorMessage?: string;
  /** Optional icon element rendered on the left inside the field */
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      label,
      errorMessage,
      leftIcon,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = variant === "error" || !!errorMessage;
    const resolvedVariant = hasError ? "error" : variant;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted-600">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({ variant: resolvedVariant, inputSize }),
              leftIcon && "pl-9",
              className,
            )}
            aria-invalid={hasError}
            aria-describedby={errorMessage ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        {errorMessage && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-red-500"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

/* ── Textarea wrapper with same variants ── */

export interface TextareaProps
  extends
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    Pick<VariantProps<typeof inputVariants>, "variant"> {
  label?: string;
  errorMessage?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, label, errorMessage, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = variant === "error" || !!errorMessage;
    const resolvedVariant = hasError ? "error" : variant;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={cn(
            inputVariants({ variant: resolvedVariant, inputSize: "md" }),
            "resize-y",
            className,
          )}
          aria-invalid={hasError}
          aria-describedby={errorMessage ? `${inputId}-error` : undefined}
          {...props}
        />
        {errorMessage && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-red-500"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Input, Textarea };

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/cn";

const buttonVariants = cva(
  // Base styles shared across all variants
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        /**
         * primary — lime background, navy label — main CTA
         */
        primary:
          "bg-brand-lime-400 text-brand-blue-900 hover:bg-brand-green-500 hover:text-brand-cream-100 focus-visible:ring-brand-lime-400",
        /**
         * solid — deep blue fill — secondary action on light backgrounds
         */
        solid:
          "bg-brand-blue-700 text-brand-cream-100 hover:bg-brand-blue-900 focus-visible:ring-brand-blue-700",
        /**
         * outline — transparent with brand border — tertiary action
         */
        outline:
          "border border-brand-blue-700 text-brand-blue-700 bg-transparent hover:bg-brand-blue-700 hover:text-brand-cream-100 focus-visible:ring-brand-blue-700",
        /**
         * ghost — no background, no border — inline action
         */
        ghost:
          "text-brand-blue-700 bg-transparent hover:bg-brand-mist-200 focus-visible:ring-brand-blue-500",
        /**
         * hero-outline — for use on dark hero backgrounds
         */
        "hero-outline":
          "border border-white/40 text-brand-cream-100 bg-transparent hover:bg-white/10 focus-visible:ring-white",
      },
      size: {
        sm: "min-h-8 px-4 py-1 text-xs",
        md: "min-h-11 px-6 py-2 text-sm",
        lg: "min-h-13 px-8 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

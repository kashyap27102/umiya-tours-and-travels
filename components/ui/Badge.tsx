import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-xl font-semibold leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        /**
         * brand — blue tint pill; category labels, package types
         */
        brand:
          "bg-brand-blue-700/10 text-brand-blue-700 border border-brand-blue-700/20",
        /**
         * success — green tint; verified, available, confirmed states
         */
        success:
          "bg-brand-green-500/12 text-brand-green-700 border border-brand-green-500/25",
        /**
         * accent — lime pill; featured, hot deal, popular tags
         */
        accent:
          "bg-brand-lime-400/20 text-brand-blue-900 border border-brand-lime-400/40",
        /**
         * outline — border only; neutral label, no fill
         */
        outline:
          "bg-transparent text-brand-muted-600 border border-brand-muted-600/40",
        /**
         * solid — inverted for use on dark hero backgrounds
         */
        solid: "bg-white/15 text-brand-cream-100 border border-white/25",
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

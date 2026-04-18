import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/cn";

const cardVariants = cva(
  // Base — always present
  "rounded-2xl overflow-hidden transition-shadow",
  {
    variants: {
      variant: {
        /**
         * default — frosted glass; usage: service highlights, quick info blocks
         */
        default:
          "bg-white/76 backdrop-blur border border-brand-blue-900/[0.09] shadow-[0_8px_24px_rgb(var(--brand-blue-rgb)/0.10)]",
        /**
         * elevated — solid white, deep shadow; usage: package cards, testimonials
         */
        elevated:
          "bg-white shadow-[0_12px_32px_rgb(var(--brand-blue-rgb)/0.14)] border border-transparent hover:shadow-[0_16px_40px_rgb(var(--brand-blue-rgb)/0.20)]",
        /**
         * tinted — brand-mist fill; usage: stat blocks, icon feature cards
         */
        tinted: "bg-brand-mist-200 border border-brand-green-500/20",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  },
);

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

/* ─── Sub-parts (optional composition) ──────────────────────── */

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold text-brand-ink-900 leading-snug",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-brand-muted-600 leading-relaxed", className)}
    {...props}
  />
));
CardBody.displayName = "CardBody";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-3 pt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardBody, CardFooter };

import * as React from "react";
import { cn } from "./cn";

/**
 * A grey placeholder block shown while content loads. It pulses, except for
 * visitors who have asked their device to reduce motion.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-xl bg-brand-blue-900/10 motion-safe:animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

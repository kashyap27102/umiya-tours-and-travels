import * as React from "react";
import { cn } from "./cn";

export interface LabelProps extends React.ComponentProps<"label"> {
  required?: boolean;
}

export function Label({
  className,
  children,
  required,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "block text-xs font-semibold uppercase tracking-wide text-brand-muted-600",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-rose-500" aria-hidden>
          *
        </span>
      )}
    </label>
  );
}

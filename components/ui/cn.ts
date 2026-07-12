import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge tailwind classes safely (handles conditional logic cleanly). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

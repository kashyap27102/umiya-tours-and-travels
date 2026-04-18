import { type ClassValue, clsx } from "clsx";

/** Merge tailwind classes safely (handles conditional logic cleanly). */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export interface PricedVariant {
  pricingMode: "flat" | "group_size";
  flatPrice: number | null;
  prices: { pricePerPerson: number }[];
}

/** Per-person price a single variant starts from, or null if it has none yet. */
export function variantStartingPrice(variant: PricedVariant): number | null {
  if (variant.pricingMode === "flat") return variant.flatPrice;
  if (variant.prices.length === 0) return null;
  return Math.min(...variant.prices.map((p) => p.pricePerPerson));
}

/** Lowest per-person price across variants; 0 when nothing is priced yet. */
export function computeStartingPrice(variants: PricedVariant[]): number {
  const prices = variants
    .map(variantStartingPrice)
    .filter((price): price is number => price !== null);
  return prices.length > 0 ? Math.min(...prices) : 0;
}

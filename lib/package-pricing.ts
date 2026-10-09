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

/** Highest per-person price a variant can cost (smallest group size), or null. */
export function variantHighestPrice(variant: PricedVariant): number | null {
  if (variant.pricingMode === "flat") return variant.flatPrice;
  if (variant.prices.length === 0) return null;
  return Math.max(...variant.prices.map((p) => p.pricePerPerson));
}

/** Lowest and highest per-person price across variants; null if none priced. */
export function computePriceRange(
  variants: PricedVariant[],
): { low: number; high: number } | null {
  const lows = variants
    .map(variantStartingPrice)
    .filter((p): p is number => p !== null);
  const highs = variants
    .map(variantHighestPrice)
    .filter((p): p is number => p !== null);
  if (lows.length === 0 || highs.length === 0) return null;
  return { low: Math.min(...lows), high: Math.max(...highs) };
}

/** Lowest per-person price across variants; 0 when nothing is priced yet. */
export function computeStartingPrice(variants: PricedVariant[]): number {
  const prices = variants
    .map(variantStartingPrice)
    .filter((price): price is number => price !== null);
  return prices.length > 0 ? Math.min(...prices) : 0;
}

/** What the price card should show for the customer's current choice. */
export interface DisplayedPrice {
  /** Small heading above the price, e.g. "Starting price" or "Deluxe". */
  label: string;
  /** Per-person price; null when the plan has no price yet. */
  perPerson: number | null;
  /** True when this is a "from" price because the group size isn't chosen. */
  isFrom: boolean;
  /** Chosen group size, when there is one. */
  persons: number | null;
  /** A hint for the customer, e.g. to pick a group size. */
  hint: string | null;
}

interface SelectableVariant extends PricedVariant {
  id: string;
  name: string;
  prices: { persons: number; pricePerPerson: number }[];
}

/**
 * Works out the price to show. Until the customer picks something it is the
 * package's starting price; after that it follows their stay level and, for
 * group-size pricing, their group size.
 */
export function displayedPrice(
  variants: SelectableVariant[],
  startingPrice: number,
  selection: { variantId: string; persons: number | null } | null,
): DisplayedPrice {
  const variant = selection
    ? variants.find((v) => v.id === selection.variantId)
    : undefined;

  if (!selection || !variant) {
    return {
      label: "Starting price",
      perPerson: startingPrice > 0 ? startingPrice : null,
      isFrom: false,
      persons: null,
      hint: null,
    };
  }

  const label = variants.length > 1 ? variant.name : "Price";

  if (variant.pricingMode === "flat") {
    return {
      label,
      perPerson: variant.flatPrice,
      isFrom: false,
      persons: null,
      hint: null,
    };
  }

  const tier = variant.prices.find((p) => p.persons === selection.persons);
  if (tier) {
    return {
      label,
      perPerson: tier.pricePerPerson,
      isFrom: false,
      persons: tier.persons,
      hint: null,
    };
  }

  return {
    label,
    perPerson: variantStartingPrice(variant),
    isFrom: variant.prices.length > 1,
    persons: null,
    hint: variant.prices.length > 0 ? "Choose a group size for the exact price." : null,
  };
}

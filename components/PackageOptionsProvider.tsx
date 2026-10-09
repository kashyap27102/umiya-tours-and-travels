"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { PublicVariant } from "@/types/package";

interface PackageOptionsValue {
  variants: PublicVariant[];
  /** The stay level currently shown. */
  variant: PublicVariant | undefined;
  /** The group size picked for the current stay level, if any. */
  persons: number | null;
  /** True once the customer has chosen a stay level or group size. */
  interacted: boolean;
  chooseVariant: (id: string) => void;
  choosePersons: (persons: number | null) => void;
}

const PackageOptionsContext = createContext<PackageOptionsValue | null>(null);

/**
 * Holds the customer's stay level and group size so the options card and the
 * price card beside it always agree.
 */
export function PackageOptionsProvider({
  variants,
  children,
}: Readonly<{ variants: PublicVariant[]; children: ReactNode }>) {
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [personsByVariant, setPersonsByVariant] = useState<
    Record<string, number | null>
  >({});
  const [interacted, setInteracted] = useState(false);

  const value = useMemo<PackageOptionsValue>(() => {
    const variant = variants.find((v) => v.id === variantId) ?? variants[0];
    return {
      variants,
      variant,
      persons: variant ? (personsByVariant[variant.id] ?? null) : null,
      interacted,
      chooseVariant: (id) => {
        setVariantId(id);
        setInteracted(true);
      },
      choosePersons: (persons) => {
        if (!variant) return;
        setPersonsByVariant((prev) => ({ ...prev, [variant.id]: persons }));
        setInteracted(true);
      },
    };
  }, [variants, variantId, personsByVariant, interacted]);

  return (
    <PackageOptionsContext.Provider value={value}>
      {children}
    </PackageOptionsContext.Provider>
  );
}

export function usePackageOptions(): PackageOptionsValue {
  const context = useContext(PackageOptionsContext);
  if (!context) {
    throw new Error("usePackageOptions must be used inside PackageOptionsProvider");
  }
  return context;
}

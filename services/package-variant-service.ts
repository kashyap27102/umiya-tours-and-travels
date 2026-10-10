import { prismaClient } from "@/lib/prisma";
import { computeStartingPrice } from "@/lib/package-pricing";
import { findStayNightsMismatch, type VariantFormValues } from "@/schemas/package";
import type { Prisma } from "@/app/generated/prisma/client";

/**
 * Checks the rules the form can't fully guarantee: stay nights add up, and each
 * chosen hotel exists in the chosen destination. Returns an error message or null.
 */
export async function validateVariants(
  variants: VariantFormValues[],
  durationNights: number,
  { checkNights = true }: { checkNights?: boolean } = {},
): Promise<string | null> {
  // Drafts skip the nights check: the stays and the total are often still changing.
  if (checkNights) {
    const mismatch = findStayNightsMismatch(variants, durationNights);
    if (mismatch) return mismatch.message;
  }

  const hotelIds = [
    ...new Set(variants.flatMap((v) => v.stays.map((s) => s.hotelId))),
  ];
  if (hotelIds.length === 0) return null;

  const hotels = await prismaClient.hotel.findMany({
    where: { id: { in: hotelIds } },
    select: { id: true, destinationId: true },
  });
  const destinationByHotel = new Map(hotels.map((h) => [h.id, h.destinationId]));

  for (const stay of variants.flatMap((v) => v.stays)) {
    const destinationId = destinationByHotel.get(stay.hotelId);
    if (destinationId === undefined) {
      return "One of the selected hotels no longer exists. Please re-select it.";
    }
    if (destinationId !== stay.destinationId) {
      return "A selected hotel doesn't belong to its destination. Please re-select it.";
    }
  }
  return null;
}

/** Variants in the shape stored on Package. */
export function toVariantCreateInput(
  variants: VariantFormValues[],
): Prisma.PackageVariantCreateWithoutPackageInput[] {
  return variants.map((v, variantIndex) => ({
    name: v.name,
    sortOrder: variantIndex,
    pricingMode: v.pricingMode,
    flatPrice: v.pricingMode === "flat" ? v.flatPrice : null,
    prices:
      v.pricingMode === "group_size"
        ? {
            create: [...v.prices]
              .sort((a, b) => a.persons - b.persons)
              .map(({ persons, pricePerPerson }) => ({ persons, pricePerPerson })),
          }
        : undefined,
    stays: {
      create: v.stays.map((s, stayIndex) => ({
        destination: { connect: { id: s.destinationId } },
        hotel: { connect: { id: s.hotelId } },
        nights: s.nights,
        roomType: s.roomType || null,
        sortOrder: stayIndex,
      })),
    },
  }));
}

/** Lowest per-person price across the submitted variants. */
export function startingPriceOf(variants: VariantFormValues[]): number {
  return computeStartingPrice(
    variants.map((v) => ({
      pricingMode: v.pricingMode,
      flatPrice: v.flatPrice,
      prices: v.pricingMode === "group_size" ? v.prices : [],
    })),
  );
}

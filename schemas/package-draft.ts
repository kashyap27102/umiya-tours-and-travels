import type { PackageFormValues, VariantFormValues } from "@/schemas/package";

type Loose = Record<string, unknown>;

const isObject = (v: unknown): v is Loose =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const strList = (v: unknown) =>
  Array.isArray(v) ? v.map(str).filter(Boolean) : [];
const objList = (v: unknown): Loose[] =>
  Array.isArray(v) ? v.filter(isObject) : [];
const wholeNumber = (v: unknown, fallback: number, min: number) =>
  typeof v === "number" && Number.isFinite(v)
    ? Math.max(min, Math.trunc(v))
    : fallback;
const positiveInt = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) && Math.trunc(v) >= 1
    ? Math.trunc(v)
    : null;

function normalizeVariants(raw: unknown): VariantFormValues[] {
  const usedNames = new Set<string>();

  return objList(raw).map((v, index) => {
    // Names must be unique per package; keep both rows rather than drop one.
    let name = str(v.name) || `Variant ${index + 1}`;
    let suffix = 2;
    while (usedNames.has(name.toLowerCase())) name = `${str(v.name) || `Variant ${index + 1}`} (${suffix++})`;
    usedNames.add(name.toLowerCase());

    const seenPersons = new Set<number>();
    const prices = objList(v.prices).flatMap((tier) => {
      const persons = positiveInt(tier.persons);
      const pricePerPerson = positiveInt(tier.pricePerPerson);
      if (persons === null || pricePerPerson === null || seenPersons.has(persons)) {
        return [];
      }
      seenPersons.add(persons);
      return [{ persons, pricePerPerson }];
    });

    // Half-filled stays are dropped; a draft only keeps complete ones.
    const stays = objList(v.stays).flatMap((stay) => {
      const destinationId = str(stay.destinationId);
      const hotelId = str(stay.hotelId);
      const nights = positiveInt(stay.nights);
      if (!destinationId || !hotelId || nights === null) return [];
      return [{ destinationId, hotelId, nights, roomType: str(stay.roomType) }];
    });

    return {
      name,
      pricingMode: v.pricingMode === "group_size" ? "group_size" : "flat",
      flatPrice: positiveInt(v.flatPrice),
      prices,
      stays,
    };
  });
}

/**
 * Cleans whatever a half-finished form sent into a PackageFormValues-shaped
 * object. Nothing here enforces "complete" rules (those apply when publishing);
 * it only drops unusable fragments so the draft can be stored safely.
 */
export function normalizeDraft(
  input: unknown,
): { error: string } | { data: PackageFormValues } {
  if (!isObject(input)) return { error: "Invalid package data." };

  const name = str(input.name);
  if (!name) return { error: "Give the draft a name before saving it." };

  const itinerary = objList(input.itinerary)
    .map((item) => ({ title: str(item.title), description: str(item.description) }))
    .filter((item) => item.title || item.description)
    .map((item, index) => ({ day: index + 1, ...item }));

  // An item is included or excluded, never both; included wins.
  const inclusionIds = [...new Set(strList(input.inclusionIds))];
  const exclusionIds = [...new Set(strList(input.exclusionIds))].filter(
    (id) => !inclusionIds.includes(id),
  );

  return {
    data: {
      name,
      status: "draft",
      destinationIds: [...new Set(strList(input.destinationIds))],
      categoryIds: [...new Set(strList(input.categoryIds))],
      durationDays: wholeNumber(input.durationDays, 1, 1),
      durationNights: wholeNumber(input.durationNights, 0, 0),
      images: strList(input.images).filter((url) => /^https?:\/\/.+/.test(url)),
      summary: str(input.summary),
      highlights: strList(input.highlights),
      inclusionIds,
      exclusionIds,
      itinerary,
      variants: normalizeVariants(input.variants),
    },
  };
}

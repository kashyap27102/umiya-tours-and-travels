import type { ItineraryDayValues } from "@/schemas/package";

/**
 * One itinerary day as stored. `description` is the legacy single paragraph,
 * kept filled from the bullet points (one per line) so older readers keep
 * working.
 */
export function toItineraryRow(item: ItineraryDayValues) {
  const points = item.points.map((p) => p.trim()).filter(Boolean);
  return {
    day: item.day,
    title: item.title,
    points,
    imageId: item.image?.id ?? null,
    imageUrl: item.image?.url ?? null,
    description: points.join("\n"),
  };
}

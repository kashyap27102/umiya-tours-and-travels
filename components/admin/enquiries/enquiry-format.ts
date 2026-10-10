import type { EnquiryStatus } from "@/app/generated/prisma/client";
import type { AdminEnquiry } from "@/services/enquiry-service";

export const ENQUIRY_STATUS_BADGE: Record<
  EnquiryStatus,
  "accent" | "brand" | "success" | "outline"
> = {
  new: "accent",
  contacted: "brand",
  quoted: "brand",
  booked: "success",
  lost: "outline",
};

export function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDay(value: unknown) {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

/** WhatsApp wants digits only with a country code; bare 10-digit numbers are Indian. */
export function whatsappUrl(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const full = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${full}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** The type-specific fields, as label/value rows for the detail view. */
export function detailRows(enquiry: AdminEnquiry): [string, string][] {
  const d = enquiry.details;
  const rows: [string, string | null][] = [];

  if (enquiry.type === "contact") {
    rows.push(["Service", str(d.serviceInterested)]);
  } else if (enquiry.type === "package") {
    rows.push(
      ["Travel date", formatDay(d.travelDate)],
      ["Travellers", d.travelers ? String(d.travelers) : null],
    );
  } else {
    rows.push(
      ["Trip type", str(d.tripType)],
      ["Vehicle", str(d.vehicleType)],
      ["Pickup", str(d.pickupLocation)],
      ["Drop", str(d.dropLocation)],
      ["Departure", formatDay(d.departureDate)],
      ["Return", formatDay(d.returnDate)],
      ["Passengers", d.passengers ? String(d.passengers) : null],
      ["Purpose", str(d.purpose)],
    );
  }
  return rows.filter((row): row is [string, string] => row[1] !== null);
}

function str(value: unknown) {
  return typeof value === "string" && value ? value : null;
}

/** One-line summary for the list. */
export function summarize(enquiry: AdminEnquiry) {
  if (enquiry.type === "package") return enquiry.packageName ?? "Package enquiry";
  if (enquiry.type === "vehicle") {
    const d = enquiry.details;
    return [str(d.vehicleType), str(d.pickupLocation) && str(d.dropLocation) ? `${d.pickupLocation} → ${d.dropLocation}` : null]
      .filter(Boolean)
      .join(" · ") || "Vehicle booking";
  }
  return str(enquiry.details.serviceInterested) ?? "General enquiry";
}

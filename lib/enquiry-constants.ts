// Safe to import from client components: no database or server-only imports.
import type { EnquiryStatus, EnquiryType } from "@/app/generated/prisma/client";

export const ENQUIRY_STATUSES = [
  "new",
  "contacted",
  "quoted",
  "booked",
  "lost",
] as const satisfies readonly EnquiryStatus[];

export const ENQUIRY_TYPES = [
  "contact",
  "package",
  "vehicle",
] as const satisfies readonly EnquiryType[];

export const ENQUIRY_STATUS_LABEL: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  booked: "Booked",
  lost: "Lost",
};

export const ENQUIRY_TYPE_LABEL: Record<EnquiryType, string> = {
  contact: "General",
  package: "Package",
  vehicle: "Vehicle",
};

export const ENQUIRY_PAGE_SIZES = [10, 25, 50] as const;

export function isStatus(value: unknown): value is EnquiryStatus {
  return (ENQUIRY_STATUSES as readonly unknown[]).includes(value);
}

export function isType(value: unknown): value is EnquiryType {
  return (ENQUIRY_TYPES as readonly unknown[]).includes(value);
}

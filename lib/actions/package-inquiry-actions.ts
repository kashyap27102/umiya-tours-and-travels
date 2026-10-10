"use server";

import { packageInquiryEmail } from "@/lib/email-templates";
import {
  packageInquirySchema,
  type PackageInquiryInput,
} from "@/schemas/package-inquiry";
import {
  RATE_LIMITED_MESSAGE,
  receiveEnquiry,
} from "@/services/enquiry-intake";
import type { ApiResponse } from "@/types/api-response";

export async function submitPackageInquiry(
  data: PackageInquiryInput,
  honeypot?: string,
): Promise<ApiResponse<null>> {
  if (honeypot) {
    return {
      success: true,
      data: null,
      message: "Your package inquiry was submitted successfully.",
    };
  }

  const parsed = packageInquirySchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check your details and try again.",
    };
  }

  const { packageSlug, travelDate, travelers, name, email, phone, message } =
    parsed.data;

  const { subject, text, html } = packageInquiryEmail({
    packageSlug,
    travelDate,
    travelers,
    name,
    email,
    phone,
    message,
  });

  const result = await receiveEnquiry(
    {
      type: "package",
      name,
      phone,
      email,
      message,
      packageSlug,
      details: {
        travelDate: travelDate ? travelDate.toISOString() : null,
        travelers: travelers ?? null,
      },
    },
    { to: process.env.CONTACT_TO_EMAIL, replyTo: email, subject, text, html },
  );

  if (result === "rate_limited") {
    return { success: false, error: RATE_LIMITED_MESSAGE };
  }
  if (result === "failed") {
    return {
      success: false,
      error:
        "Unable to send your inquiry right now. Please try again or call us directly.",
    };
  }
  return {
    success: true,
    data: null,
    message: "Your package inquiry was submitted successfully.",
  };
}

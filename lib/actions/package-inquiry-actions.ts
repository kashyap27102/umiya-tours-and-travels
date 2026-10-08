"use server";

import { packageInquiryEmail } from "@/lib/email-templates";
import { sendMail } from "@/lib/mailer";
import {
  packageInquirySchema,
  type PackageInquiryInput,
} from "@/schemas/package-inquiry";
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

  try {
    await sendMail({
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject,
      text,
      html,
    });

    return {
      success: true,
      data: null,
      message: "Your package inquiry was submitted successfully.",
    };
  } catch (error) {
    console.error("Failed to send package inquiry email:", error);
    return {
      success: false,
      error:
        "Unable to send your inquiry right now. Please try again or call us directly.",
    };
  }
}

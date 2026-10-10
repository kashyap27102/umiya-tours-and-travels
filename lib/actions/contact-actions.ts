"use server";

import { contactInquiryEmail } from "@/lib/email-templates";
import { contactSchema, type ContactData } from "@/schemas/contact";
import {
  RATE_LIMITED_MESSAGE,
  receiveEnquiry,
} from "@/services/enquiry-intake";
import type { ApiResponse } from "@/types/api-response";

export async function submitContactForm(
  data: ContactData,
  honeypot?: string,
): Promise<ApiResponse<null>> {
  if (honeypot) {
    return {
      success: true,
      data: null,
      message: "Your inquiry was submitted successfully.",
    };
  }

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check your details and try again.",
    };
  }

  const { name, email, phone, serviceInterested, message } = parsed.data;
  const { subject, text, html } = contactInquiryEmail({
    name,
    email,
    phone,
    serviceInterested,
    message,
  });

  const result = await receiveEnquiry(
    {
      type: "contact",
      name,
      phone,
      email,
      message,
      details: { serviceInterested },
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
        "Unable to send your message right now. Please try again or call us directly.",
    };
  }
  return {
    success: true,
    data: null,
    message: "Your inquiry was submitted successfully.",
  };
}

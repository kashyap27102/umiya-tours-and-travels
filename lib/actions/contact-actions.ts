"use server";

import { contactInquiryEmail } from "@/lib/email-templates";
import { sendMail } from "@/lib/mailer";
import { contactSchema, type ContactData } from "@/schemas/contact";
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
      message: "Your inquiry was submitted successfully.",
    };
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    return {
      success: false,
      error:
        "Unable to send your message right now. Please try again or call us directly.",
    };
  }
}

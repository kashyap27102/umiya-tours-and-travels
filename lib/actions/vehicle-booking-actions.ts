"use server";

import { vehicleInquiryEmail } from "@/lib/email-templates";
import { sendMail } from "@/lib/mailer";
import {
  vehicleBookingSchema,
  type VehicleBookingInput,
} from "@/schemas/vehicle-booking";
import type { ApiResponse } from "@/types/api-response";

export async function submitVehicleBookingForm(
  data: VehicleBookingInput,
): Promise<ApiResponse<null>> {
  const parsed = vehicleBookingSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check your details and try again.",
    };
  }

  const {
    tripType,
    vehicleType,
    pickupLocation,
    dropLocation,
    departureDate,
    returnDate,
    passengers,
    purpose,
    contactName,
    contactPhone,
    contactEmail,
    specialRequests,
  } = parsed.data;

  const { subject, text, html } = vehicleInquiryEmail({
    tripType,
    vehicleType,
    pickupLocation,
    dropLocation,
    departureDate,
    returnDate,
    passengers,
    purpose: purpose || undefined,
    contactName: contactName || undefined,
    contactPhone: contactPhone || undefined,
    contactEmail: contactEmail || undefined,
    specialRequests: specialRequests || undefined,
  });

  try {
    await sendMail({
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: contactEmail || undefined,
      subject,
      text,
      html,
    });

    return {
      success: true,
      data: null,
      message: "Your vehicle booking request was submitted successfully.",
    };
  } catch (error) {
    console.error("Failed to send vehicle booking email:", error);
    return {
      success: false,
      error:
        "Unable to submit your request right now. Please try again or call us directly.",
    };
  }
}

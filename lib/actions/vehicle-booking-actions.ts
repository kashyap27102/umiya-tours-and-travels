"use server";

import { vehicleInquiryEmail } from "@/lib/email-templates";
import {
  vehicleBookingSchema,
  type VehicleBookingInput,
} from "@/schemas/vehicle-booking";
import {
  RATE_LIMITED_MESSAGE,
  receiveEnquiry,
} from "@/services/enquiry-intake";
import type { ApiResponse } from "@/types/api-response";

export async function submitVehicleBookingForm(
  data: VehicleBookingInput,
  honeypot?: string,
): Promise<ApiResponse<null>> {
  if (honeypot) {
    return {
      success: true,
      data: null,
      message: "Your vehicle booking request was submitted successfully.",
    };
  }

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

  const result = await receiveEnquiry(
    {
      type: "vehicle",
      name: contactName || "",
      phone: contactPhone || "",
      email: contactEmail || null,
      message: specialRequests || "",
      details: {
        tripType,
        vehicleType,
        pickupLocation,
        dropLocation,
        departureDate: departureDate.toISOString(),
        returnDate: returnDate ? returnDate.toISOString() : null,
        passengers,
        purpose: purpose || null,
      },
    },
    {
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: contactEmail || undefined,
      subject,
      text,
      html,
    },
  );

  if (result === "rate_limited") {
    return { success: false, error: RATE_LIMITED_MESSAGE };
  }
  if (result === "failed") {
    return {
      success: false,
      error:
        "Unable to submit your request right now. Please try again or call us directly.",
    };
  }
  return {
    success: true,
    data: null,
    message: "Your vehicle booking request was submitted successfully.",
  };
}

"use server";

import { revalidatePath } from "next/cache";
import { prismaClient } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { isStatus } from "@/lib/enquiry-constants";
import type { ApiResponse } from "@/types/api-response";

const UNAUTHORIZED = "You must be signed in as an admin.";
const MAX_NOTES = 2000;

function revalidateEnquiries() {
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function setEnquiryStatus(
  id: string,
  status: string,
): Promise<ApiResponse<null>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };
  if (!isStatus(status)) return { success: false, error: "Unknown status." };

  try {
    const result = await prismaClient.enquiry.updateMany({
      where: { id },
      data: { status, statusChangedAt: new Date() },
    });
    if (result.count === 0) return { success: false, error: "Enquiry not found." };
    revalidateEnquiries();
    return { success: true, data: null, message: "Status updated" };
  } catch (error) {
    console.error("Failed to update enquiry status:", error);
    return { success: false, error: "Failed to update the status." };
  }
}

export async function saveEnquiryNotes(
  id: string,
  notes: string,
): Promise<ApiResponse<null>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };
  if (typeof notes !== "string" || notes.length > MAX_NOTES) {
    return {
      success: false,
      error: `Notes can be up to ${MAX_NOTES} characters.`,
    };
  }

  try {
    const result = await prismaClient.enquiry.updateMany({
      where: { id },
      data: { notes: notes.trim() },
    });
    if (result.count === 0) return { success: false, error: "Enquiry not found." };
    revalidatePath("/admin/enquiries");
    return { success: true, data: null, message: "Notes saved" };
  } catch (error) {
    console.error("Failed to save enquiry notes:", error);
    return { success: false, error: "Failed to save the notes." };
  }
}

export async function deleteEnquiry(id: string): Promise<ApiResponse<null>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  try {
    const result = await prismaClient.enquiry.deleteMany({ where: { id } });
    if (result.count === 0) return { success: false, error: "Enquiry not found." };
    revalidateEnquiries();
    return { success: true, data: null, message: "Enquiry deleted" };
  } catch (error) {
    console.error("Failed to delete enquiry:", error);
    return { success: false, error: "Failed to delete the enquiry." };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { prismaClient } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import {
  testimonialFormSchema,
  type TestimonialFormInput,
} from "@/schemas/testimonial";
import type { ApiResponse } from "@/types/api-response";

const UNAUTHORIZED = "You must be signed in as an admin.";

function revalidateTestimonials() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

/** Checks the optional links point at things that exist. */
async function checkLinks(data: {
  imageId: string | null;
  destinationId: string | null;
  packageId: string | null;
}): Promise<string | null> {
  const [image, destination, pkg] = await Promise.all([
    data.imageId
      ? prismaClient.mediaImage.findUnique({
          where: { id: data.imageId },
          select: { id: true },
        })
      : true,
    data.destinationId
      ? prismaClient.destination.findUnique({
          where: { id: data.destinationId },
          select: { id: true },
        })
      : true,
    data.packageId
      ? prismaClient.package.findUnique({
          where: { id: data.packageId },
          select: { id: true },
        })
      : true,
  ]);
  if (!image) return "The chosen photo no longer exists. Pick another one.";
  if (!destination) return "The chosen destination no longer exists.";
  if (!pkg) return "The chosen package no longer exists.";
  return null;
}

export async function createTestimonial(
  input: TestimonialFormInput,
): Promise<ApiResponse<{ id: string }>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = testimonialFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const linkError = await checkLinks(parsed.data);
    if (linkError) return { success: false, error: linkError };

    // New reviews go to the top of the list.
    const first = await prismaClient.testimonial.aggregate({
      _min: { sortOrder: true },
    });
    const created = await prismaClient.testimonial.create({
      data: { ...parsed.data, sortOrder: (first._min.sortOrder ?? 0) - 1 },
      select: { id: true },
    });
    revalidateTestimonials();
    return { success: true, data: created, message: "Testimonial added" };
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return { success: false, error: "Failed to add the testimonial." };
  }
}

export async function updateTestimonial(
  id: string,
  input: TestimonialFormInput,
): Promise<ApiResponse<{ id: string }>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = testimonialFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const existing = await prismaClient.testimonial.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) return { success: false, error: "Testimonial not found." };

    const linkError = await checkLinks(parsed.data);
    if (linkError) return { success: false, error: linkError };

    await prismaClient.testimonial.update({ where: { id }, data: parsed.data });
    revalidateTestimonials();
    return { success: true, data: { id }, message: "Testimonial updated" };
  } catch (error) {
    console.error("Failed to update testimonial:", error);
    return { success: false, error: "Failed to update the testimonial." };
  }
}

export async function setTestimonialActive(
  id: string,
  isActive: boolean,
): Promise<ApiResponse<null>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  try {
    const result = await prismaClient.testimonial.updateMany({
      where: { id },
      data: { isActive },
    });
    if (result.count === 0) {
      return { success: false, error: "Testimonial not found." };
    }
    revalidateTestimonials();
    return {
      success: true,
      data: null,
      message: isActive ? "Testimonial is now visible" : "Testimonial hidden",
    };
  } catch (error) {
    console.error("Failed to change testimonial visibility:", error);
    return { success: false, error: "Failed to change visibility." };
  }
}

/** Moves a review one place up or down in the list. */
export async function moveTestimonial(
  id: string,
  direction: "up" | "down",
): Promise<ApiResponse<null>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  try {
    const rows = await prismaClient.testimonial.findMany({
      select: { id: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    const from = rows.findIndex((row) => row.id === id);
    if (from === -1) return { success: false, error: "Testimonial not found." };
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= rows.length) {
      return { success: true, data: null, message: "Already there" };
    }

    const ids = rows.map((row) => row.id);
    [ids[from], ids[to]] = [ids[to], ids[from]];
    // Renumber the whole list so ties and gaps can't make a move do nothing.
    await prismaClient.$transaction(
      ids.map((rowId, index) =>
        prismaClient.testimonial.update({
          where: { id: rowId },
          data: { sortOrder: index },
        }),
      ),
    );
    revalidateTestimonials();
    return { success: true, data: null, message: "Order updated" };
  } catch (error) {
    console.error("Failed to reorder testimonials:", error);
    return { success: false, error: "Failed to change the order." };
  }
}

export async function deleteTestimonial(id: string): Promise<ApiResponse<null>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  try {
    const result = await prismaClient.testimonial.deleteMany({ where: { id } });
    if (result.count === 0) {
      return { success: false, error: "Testimonial not found." };
    }
    revalidateTestimonials();
    return { success: true, data: null, message: "Testimonial deleted" };
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    return { success: false, error: "Failed to delete the testimonial." };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { prismaClient } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { trendingSchema, type TrendingInput } from "@/schemas/trending";
import type { ApiResponse } from "@/types/api-response";

const UNAUTHORIZED = "You must be signed in as an admin.";
const SETTINGS_ID = 1;

export async function saveTrending(
  input: TrendingInput,
): Promise<ApiResponse<null>> {
  if (!(await verifySession())) return { success: false, error: UNAUTHORIZED };

  const parsed = trendingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { title, subtitle, packageIds } = parsed.data;

  try {
    // Only live packages can be shown, and the browser's list can't be trusted.
    const live = await prismaClient.package.findMany({
      where: { id: { in: packageIds }, status: "active" },
      select: { id: true },
    });
    if (live.length !== packageIds.length) {
      return {
        success: false,
        error:
          "One of the chosen packages is no longer active. Reload the page and choose again.",
      };
    }

    await prismaClient.$transaction([
      prismaClient.siteSettings.upsert({
        where: { id: SETTINGS_ID },
        update: { trendingTitle: title, trendingSubtitle: subtitle },
        create: {
          id: SETTINGS_ID,
          siteName: "",
          phone: "",
          email: "",
          whatsappNumber: "",
          address: "",
          heroEyebrow: "",
          heroHeading: "",
          heroSubheading: "",
          aboutHeading: "",
          aboutDescription: "",
          missionHeading: "",
          missionDescription: "",
          stats: [],
          testimonials: [],
          footerTagline: "",
          trendingTitle: title,
          trendingSubtitle: subtitle,
        },
      }),
      prismaClient.trendingPackage.deleteMany({}),
      prismaClient.trendingPackage.createMany({
        data: packageIds.map((packageId, sortOrder) => ({ packageId, sortOrder })),
      }),
    ]);

    revalidatePath("/");
    revalidatePath("/admin/trending");
    return { success: true, data: null, message: "Trending section saved" };
  } catch (error) {
    console.error("Failed to save trending section:", error);
    return { success: false, error: "Failed to save. Please try again." };
  }
}

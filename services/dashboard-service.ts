import { prismaClient } from "@/lib/prisma";
import type { PackageStatus } from "@/lib/packages-constants";

export interface DashboardData {
  packages: { total: number; active: number; draft: number; inactive: number };
  destinations: number;
  hotels: number;
  categories: number;
  inclusions: number;
  gallery: { total: number; unused: number };
  testimonials: { total: number; visible: number };
  enquiries: { total: number; new: number };
  settingsComplete: boolean;
  recentPackages: {
    id: string;
    name: string;
    slug: string;
    status: PackageStatus;
    startingPrice: number;
    updatedAt: string;
  }[];
  /** Things the agency should look at, each with where to fix it. */
  attention: { label: string; count: number; href: string }[];
}

export class DashboardService {
  static async get(): Promise<DashboardData> {
    const [
      statusGroups,
      destinations,
      hotels,
      categories,
      inclusions,
      galleryTotal,
      galleryUnused,
      testimonialTotal,
      testimonialVisible,
      settings,
      recent,
      destinationsWithoutHotels,
      activeWithoutImage,
      activeWithoutVariants,
      hiddenTestimonials,
      enquiryTotal,
      enquiryNew,
      enquiryStale,
    ] = await Promise.all([
      prismaClient.package.groupBy({ by: ["status"], _count: { _all: true } }),
      prismaClient.destination.count(),
      prismaClient.hotel.count(),
      prismaClient.category.count(),
      prismaClient.inclusion.count(),
      prismaClient.mediaImage.count(),
      prismaClient.mediaImage.count({
        where: {
          packageLinks: { none: {} },
          itineraryDays: { none: {} },
          testimonials: { none: {} },
        },
      }),
      prismaClient.testimonial.count(),
      prismaClient.testimonial.count({ where: { isActive: true } }),
      prismaClient.siteSettings.findFirst({ where: { id: 1 } }),
      prismaClient.package.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          startingPrice: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prismaClient.destination.count({ where: { hotels: { none: {} } } }),
      prismaClient.package.count({
        where: { status: "active", imageLinks: { none: {} } },
      }),
      prismaClient.package.count({
        where: { status: "active", variants: { none: {} } },
      }),
      prismaClient.testimonial.count({ where: { isActive: false } }),
      prismaClient.enquiry.count(),
      prismaClient.enquiry.count({ where: { status: "new" } }),
      prismaClient.enquiry.count({
        where: {
          status: "new",
          createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    const byStatus = (status: PackageStatus) =>
      statusGroups.find((g) => g.status === status)?._count._all ?? 0;
    const packages = {
      active: byStatus("active"),
      draft: byStatus("draft"),
      inactive: byStatus("inactive"),
      total: statusGroups.reduce((sum, g) => sum + g._count._all, 0),
    };

    const settingsComplete =
      !!settings &&
      [
        settings.siteName,
        settings.phone,
        settings.email,
        settings.whatsappNumber,
        settings.address,
        settings.heroHeading,
        settings.aboutHeading,
        settings.footerTagline,
      ].every((value) => value.trim().length > 0);

    const attention = [
      {
        label: "Enquiries waiting over 24 hours with no action",
        count: enquiryStale,
        href: "/admin/enquiries?status=new",
      },
      {
        label: "Draft packages waiting to be finished",
        count: packages.draft,
        href: "/admin/package-management?status=draft",
      },
      {
        label: "Active packages with no photo",
        count: activeWithoutImage,
        href: "/admin/package-management?status=active",
      },
      {
        label: "Active packages with no stay options or prices",
        count: activeWithoutVariants,
        href: "/admin/package-management?status=active",
      },
      {
        label: "Destinations with no hotels yet",
        count: destinationsWithoutHotels,
        href: "/admin/destinations",
      },
      {
        label: "Gallery images not used anywhere",
        count: galleryUnused,
        href: "/admin/gallery",
      },
      {
        label: "Testimonials hidden from the site",
        count: hiddenTestimonials,
        href: "/admin/testimonials",
      },
      {
        label: "Site settings not fully filled in",
        count: settingsComplete ? 0 : 1,
        href: "/admin/settings",
      },
    ].filter((item) => item.count > 0);

    return {
      packages,
      destinations,
      hotels,
      categories,
      inclusions,
      gallery: { total: galleryTotal, unused: galleryUnused },
      testimonials: { total: testimonialTotal, visible: testimonialVisible },
      enquiries: { total: enquiryTotal, new: enquiryNew },
      settingsComplete,
      recentPackages: recent.map((p) => ({
        ...p,
        status: p.status as PackageStatus,
        updatedAt: p.updatedAt.toISOString(),
      })),
      attention,
    };
  }
}

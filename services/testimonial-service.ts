import { prismaClient } from "@/lib/prisma";

/** A review as the admin list and form see it. */
export interface AdminTestimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  image: { id: string; url: string; alt: string; title: string } | null;
  destination: { id: string; name: string } | null;
  package: { id: string; name: string; slug: string; status: string } | null;
}

/** A review as the public home page shows it. */
export interface PublicTestimonial {
  id: string;
  name: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  review: string;
  image: { url: string; alt: string } | null;
  destinationName: string | null;
  /** Name of the linked package, shown even if it is no longer live. */
  packageName: string | null;
  /** Only set when the linked package is live, so the link never 404s. */
  packageLink: { slug: string; name: string } | null;
}

/** One page of the public reviews page, with figures over all visible reviews. */
export interface PublicReviewsPage {
  items: PublicTestimonial[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /** Average rating, one decimal place; 0 when there are no reviews. */
  average: number;
  /** How many reviews gave 5, 4, 3, 2 and 1 stars (index 0 is 5 stars). */
  distribution: [number, number, number, number, number];
}

export interface TestimonialFormOptions {
  destinations: { id: string; name: string }[];
  packages: { id: string; name: string; status: string }[];
}

const adminInclude = {
  image: { select: { id: true, url: true, alt: true, title: true } },
  destination: { select: { id: true, name: true } },
  package: { select: { id: true, name: true, slug: true, status: true } },
} as const;

function toPublic(row: {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  image: { url: string; alt: string } | null;
  destination: { name: string } | null;
  package: { slug: string; name: string; status: string } | null;
}): PublicTestimonial {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    rating: Math.min(5, Math.max(1, row.rating)) as PublicTestimonial["rating"],
    review: row.review,
    image: row.image
      ? { url: row.image.url, alt: row.image.alt || `${row.name}'s photo` }
      : null,
    destinationName: row.destination?.name ?? null,
    packageName: row.package?.name ?? null,
    packageLink:
      row.package?.status === "active"
        ? { slug: row.package.slug, name: row.package.name }
        : null,
  };
}

export class TestimonialService {
  /** The public reviews page: one page of reviews plus the overall figures. */
  static async getPublicPage({
    page = 1,
    pageSize = 12,
  }: { page?: number; pageSize?: number } = {}): Promise<PublicReviewsPage> {
    const size = Math.min(Math.max(1, pageSize), 48);
    const groups = await prismaClient.testimonial.groupBy({
      by: ["rating"],
      where: { isActive: true },
      _count: { _all: true },
    });
    const distribution: PublicReviewsPage["distribution"] = [0, 0, 0, 0, 0];
    let total = 0;
    let sum = 0;
    for (const g of groups) {
      const stars = Math.min(5, Math.max(1, g.rating));
      distribution[5 - stars] += g._count._all;
      total += g._count._all;
      sum += stars * g._count._all;
    }

    const totalPages = Math.max(1, Math.ceil(total / size));
    const current = Math.min(Math.max(1, page), totalPages);
    const rows = await prismaClient.testimonial.findMany({
      where: { isActive: true },
      include: adminInclude,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (current - 1) * size,
      take: size,
      relationLoadStrategy: "join",
    });

    return {
      items: rows.map(toPublic),
      total,
      page: current,
      pageSize: size,
      totalPages,
      average: total ? Math.round((sum / total) * 10) / 10 : 0,
      distribution,
    };
  }

  /** Every review, in the order they appear on the site. */
  static async listForAdmin(): Promise<AdminTestimonial[]> {
    const rows = await prismaClient.testimonial.findMany({
      include: adminInclude,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      relationLoadStrategy: "join",
    });
    return rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  /** Choices for the destination and package dropdowns. */
  static async getFormOptions(): Promise<TestimonialFormOptions> {
    const [destinations, packages] = await Promise.all([
      prismaClient.destination.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prismaClient.package.findMany({
        select: { id: true, name: true, status: true },
        orderBy: { name: "asc" },
      }),
    ]);
    return { destinations, packages };
  }

  /** Visible reviews for the home page. */
  static async getPublic(): Promise<PublicTestimonial[]> {
    const rows = await prismaClient.testimonial.findMany({
      where: { isActive: true },
      include: adminInclude,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      relationLoadStrategy: "join",
    });
    return rows.map(toPublic);
  }
}

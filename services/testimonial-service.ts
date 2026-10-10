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
  /** Only set when the linked package is live, so the link never 404s. */
  packageLink: { slug: string; name: string } | null;
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

export class TestimonialService {
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
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      location: row.location,
      rating: Math.min(5, Math.max(1, row.rating)) as PublicTestimonial["rating"],
      review: row.review,
      image: row.image
        ? { url: row.image.url, alt: row.image.alt || `${row.name}'s photo` }
        : null,
      destinationName: row.destination?.name ?? null,
      packageLink:
        row.package?.status === "active"
          ? { slug: row.package.slug, name: row.package.name }
          : null,
    }));
  }
}

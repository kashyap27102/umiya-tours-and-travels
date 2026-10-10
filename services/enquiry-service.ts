import { prismaClient } from "@/lib/prisma";
import { ENQUIRY_STATUSES, isStatus, isType } from "@/lib/enquiry-constants";
import type {
  EnquiryStatus,
  EnquiryType,
  Prisma,
} from "@/app/generated/prisma/client";

/** An enquiry as the admin list and detail view see it. */
export interface AdminEnquiry {
  id: string;
  type: EnquiryType;
  status: EnquiryStatus;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  packageName: string | null;
  /** Slug of the package if it still exists, for the link. */
  packageSlug: string | null;
  details: Record<string, unknown>;
  notes: string;
  createdAt: string;
  statusChangedAt: string | null;
}

export interface EnquiryPage {
  items: AdminEnquiry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NewEnquiry {
  type: EnquiryType;
  name: string;
  phone: string;
  email?: string | null;
  message?: string;
  packageSlug?: string;
  details?: Record<string, unknown>;
}

// More than this many from one phone or email in the window is treated as spam.
const RATE_LIMIT_COUNT = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export class EnquiryService {
  /** True when this phone/email has already sent too many recently. */
  static async isRateLimited(phone: string, email?: string | null) {
    const identities: Prisma.EnquiryWhereInput[] = [];
    if (phone) identities.push({ phone });
    if (email) identities.push({ email: { equals: email, mode: "insensitive" } });
    if (identities.length === 0) return false;

    const recent = await prismaClient.enquiry.count({
      where: {
        OR: identities,
        createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) },
      },
    });
    return recent >= RATE_LIMIT_COUNT;
  }

  static async create(input: NewEnquiry): Promise<{ id: string }> {
    const pkg = input.packageSlug
      ? await prismaClient.package.findUnique({
          where: { slug: input.packageSlug },
          select: { id: true, name: true },
        })
      : null;

    return prismaClient.enquiry.create({
      data: {
        type: input.type,
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        message: input.message ?? "",
        packageId: pkg?.id ?? null,
        packageName: pkg?.name ?? null,
        details: (input.details ?? {}) as Prisma.InputJsonObject,
      },
      select: { id: true },
    });
  }

  static async list({
    status,
    type,
    search,
    page = 1,
    pageSize = 10,
  }: {
    status?: string;
    type?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<EnquiryPage> {
    const q = search?.trim();
    const where: Prisma.EnquiryWhereInput = {
      ...(isStatus(status) && { status }),
      ...(isType(type) && { type }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { phone: { contains: q.replace(/\s+/g, "") } },
          { email: { contains: q, mode: "insensitive" } },
          { message: { contains: q, mode: "insensitive" } },
          { packageName: { contains: q, mode: "insensitive" } },
        ],
      }),
    };

    const size = Math.min(Math.max(1, pageSize), 100);
    const total = await prismaClient.enquiry.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / size));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    const rows = await prismaClient.enquiry.findMany({
      where,
      include: { package: { select: { slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * size,
      take: size,
    });

    return {
      items: rows.map(toAdmin),
      total,
      page: currentPage,
      pageSize: size,
      totalPages,
    };
  }

  /** How many enquiries are in each status (for tabs, sidebar and dashboard). */
  static async countsByStatus(): Promise<Record<EnquiryStatus, number>> {
    const groups = await prismaClient.enquiry.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    const counts = Object.fromEntries(
      ENQUIRY_STATUSES.map((s) => [s, 0]),
    ) as Record<EnquiryStatus, number>;
    for (const g of groups) counts[g.status] = g._count._all;
    return counts;
  }

  static async countNew(): Promise<number> {
    return prismaClient.enquiry.count({ where: { status: "new" } });
  }
}

function toAdmin(
  row: Prisma.EnquiryGetPayload<{
    include: { package: { select: { slug: true } } };
  }>,
): AdminEnquiry {
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    name: row.name,
    phone: row.phone,
    email: row.email,
    message: row.message,
    packageName: row.packageName,
    packageSlug: row.package?.slug ?? null,
    details:
      row.details && typeof row.details === "object" && !Array.isArray(row.details)
        ? (row.details as Record<string, unknown>)
        : {},
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
    statusChangedAt: row.statusChangedAt?.toISOString() ?? null,
  };
}

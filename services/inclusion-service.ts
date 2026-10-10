import { prismaClient } from "@/lib/prisma";

export class InclusionNotFoundError extends Error {
  constructor() {
    super("Inclusion not found");
    this.name = "InclusionNotFoundError";
  }
}

/**
 * Rewords a shared item. Packages keep a plain-text copy of their lists for
 * the public pages, so every package using the item gets its copy refreshed in
 * the same transaction. Returns how many packages were refreshed.
 */
export async function renameInclusion(id: string, text: string): Promise<number> {
  return prismaClient.$transaction(async (tx) => {
    const previous = await tx.inclusion.findUnique({ where: { id } });
    if (!previous) throw new InclusionNotFoundError();

    await tx.inclusion.update({ where: { id }, data: { text } });
    if (previous.text === text) return 0;

    const affected = await tx.package.findMany({
      where: { inclusionLinks: { some: { inclusionId: id } } },
      select: { id: true, inclusions: true, exclusions: true },
    });
    for (const pkg of affected) {
      const swap = (list: string[]) =>
        list.map((item) => (item === previous.text ? text : item));
      await tx.package.update({
        where: { id: pkg.id },
        data: {
          inclusions: swap(pkg.inclusions),
          exclusions: swap(pkg.exclusions),
        },
      });
    }
    return affected.length;
  });
}

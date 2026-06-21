import { PrismaClient } from "@/app/generated/prisma/client";
declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined;
}

const prismaClient =
  global.prismaClient ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaClient = prismaClient;
}

export { prismaClient };

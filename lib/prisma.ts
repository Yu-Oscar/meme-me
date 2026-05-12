import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const connectionString =
  process.env["DATABASE_URL"] ?? process.env["DIRECT_DATABASE_URL"];

if (!connectionString) {
  throw new Error(
    "Missing database connection string. Set DATABASE_URL (runtime) or DIRECT_DATABASE_URL.",
  );
}

const adapter = new PrismaPg({
  connectionString,
  max: 3,
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

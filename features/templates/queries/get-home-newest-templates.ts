import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getHomeNewestTemplates = cache(async () => {
  return prisma.templates.findMany({
    take: 12,
    orderBy: {
      created_at: "desc",
    },
  });
});

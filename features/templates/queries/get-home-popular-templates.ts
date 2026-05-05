import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getHomePopularTemplates = cache(async () => {
  return prisma.templates.findMany({
    take: 20,
    orderBy: {
      view_count: "desc",
    },
  });
});

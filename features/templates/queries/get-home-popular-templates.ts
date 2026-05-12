import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getHomePopularTemplates = cache(async () => {
  return prisma.templates.findMany({
    take: 20,
    orderBy: [
      { views_last_24h: "desc" },
      { views_last_7d: "desc" },
      { views_last_30d: "desc" },
      { view_count: "desc" },
    ],
  });
});

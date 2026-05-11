import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getRecommendedTemplates = cache(async (templateId: string, tags: string[]) => {
  const where =
    tags.length > 0
      ? {
          id: { not: templateId },
          tags: { hasSome: tags },
        }
      : {
          id: { not: templateId },
        };

  return prisma.templates.findMany({
    where,
    orderBy: { views_last_24h: "desc" },
    take: 10,
  });
});

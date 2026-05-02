import { prisma } from "@/lib/prisma";

export const getHomePopularTemplates = async () => {
  const templates = await prisma.templates.findMany({
    take: 20,
    orderBy: {
      view_count: "desc",
    },
  });

  return templates;
};

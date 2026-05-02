import { prisma } from "@/lib/prisma";

export const getHomeNewestTemplates = async () => {
  const templates = await prisma.templates.findMany({
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });

  return templates;
};

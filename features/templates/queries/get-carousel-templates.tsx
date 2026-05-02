import { prisma } from "@/lib/prisma";

export const getCarouselTemplates = async () => {
  const templates = await prisma.templates.findMany({
    take: 6,
    orderBy: {
      view_count: "desc",
    },
  });

  return templates;
};

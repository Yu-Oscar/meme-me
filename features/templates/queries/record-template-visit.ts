import { prisma } from "@/lib/prisma";


export const recordTemplateVisit = async (templateId: string) => {
  const now = new Date();

  await prisma.$transaction([
    prisma.template_view.create({
      data: { templateId },
    }),
    prisma.templates.update({
      where: { id: templateId },
      data: {
        view_count: { increment: 1 },
        last_viewed_at: now,
        updated_at: now,
      },
    }),
  ]);
};

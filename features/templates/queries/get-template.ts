import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getTemplate = cache(async (id: string) => {
  const template = await prisma.templates.findUnique({
    where: {
      slug: id,
    },
  });
  return template;
});


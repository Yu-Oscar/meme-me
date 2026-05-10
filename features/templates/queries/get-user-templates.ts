import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getUserTemplates = cache(async (userId: number) => {
  return prisma.templates.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
});

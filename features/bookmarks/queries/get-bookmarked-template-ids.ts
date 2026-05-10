import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getBookmarkedTemplateIds = cache(async (userId: number) => {
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId,
    },
    select: {
      templateId: true,
    },
  });

  return bookmarks.map((bookmark) => bookmark.templateId);
});

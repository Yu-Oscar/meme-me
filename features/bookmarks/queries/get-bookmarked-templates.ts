import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getBookmarkedTemplates = cache(async (userId: number) => {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { created_at: "desc" },
    include: { template: true },
  });

  return bookmarks.map((b) => b.template);
});

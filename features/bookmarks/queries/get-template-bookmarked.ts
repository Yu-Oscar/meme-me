import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getTemplateBookmarked = cache(async (templateId: string, userId: number) => {
  try {
    if (userId === 0) return false;
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId_templateId: { userId, templateId } },
    });
    return bookmark ? true : false;
  } catch (error) {
    console.error("Error getting template bookmarked", error);
    return false;
  }
});
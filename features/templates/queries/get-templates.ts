import { prisma } from "@/lib/prisma";
import { ParsedSearchParams } from "@/features/templates/search-params";
import { TEMPLATES_PAGE_SIZE } from "@/features/templates/templates-page-size";
import { cache } from "react";

export const getTemplates = cache(async (parsed: ParsedSearchParams, orderBy?: string) => {
  const page = parsed.page;
  const size = TEMPLATES_PAGE_SIZE;
  const skip = page * size;

  const where = {
    OR: [
      {
        name: {
          contains: parsed.search,
          mode: "insensitive" as const,
        },
      },
      {
        tags: {
          has: parsed.search,
        },
      },
    ],
  };

  const [templates, count] = await Promise.all([
    prisma.templates.findMany({
      where,
      take: size,
      skip,
      orderBy: [{ [orderBy ?? "created_at"]: "desc" }, { created_at: "desc" }],
    }),
    prisma.templates.count({ where }),
  ]);

  return {
    list: templates,
    metadata: {
      count,
      hasNextPage: skip + size < count,
    },
  };
});

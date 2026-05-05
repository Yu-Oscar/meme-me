import { prisma } from "@/lib/prisma";
import { ParsedSearchParams } from "@/features/templates/search-params";

export const getTemplates = async (parsed: ParsedSearchParams, orderBy?: string) => {
    const page = parsed.page;
    const size = 2;
    const skip = page * size;

    const where = {
      ...(typeof parsed.search === "string" && {
        name: {
          contains: parsed.search,
          mode: "insensitive" as const,
        },
      }),
    };

    const [templates, count] = await prisma.$transaction([
      prisma.templates.findMany({
        where,
        take: size,
        skip: skip,
        orderBy: [
          { [orderBy ?? "created_at"]: "desc" },
          { created_at: "desc" },
        ],
      }),
      prisma.templates.count({ where }),
    ]);

    return {
        list: templates,
        metadata: {
            count,
            hasNextPage: skip + size < count,
        }
    };
};

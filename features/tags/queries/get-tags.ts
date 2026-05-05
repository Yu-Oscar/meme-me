import { prisma } from "@/lib/prisma";
import { cache } from "react";

export type TagWithCount = {
  tag: string;
  templateCount: number;
};

export const getTags = cache(async (): Promise<TagWithCount[]> => {
  const rows = await prisma.$queryRaw<TagWithCount[]>`
    SELECT
      u.tag AS tag,
      COUNT(*)::int AS "templateCount"
    FROM public.templates
    CROSS JOIN LATERAL unnest(tags) AS u(tag)
    WHERE cardinality(tags) > 0
    GROUP BY u.tag
    ORDER BY COUNT(*) DESC, u.tag ASC
  `;

  return rows;
});

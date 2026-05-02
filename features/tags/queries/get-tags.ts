import { prisma } from "@/lib/prisma";

export type TagWithCount = {
  tag: string;
  templateCount: number;
};

export const getTags = async (): Promise<TagWithCount[]> => {
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
};

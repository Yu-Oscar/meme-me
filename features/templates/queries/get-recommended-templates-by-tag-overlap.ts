import type { templates } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

/**
 * Recommendations ranked by how many tags overlap the current template (distinct),
 * then by 24h views. When the current template has no tags, falls back to global
 * top templates by 24h views (same as the simple Prisma query).
 */
export const getRecommendedTemplatesByTagOverlap = cache(
  async (templateId: string, tags: string[]): Promise<templates[]> => {
    if (tags.length === 0) {
      return prisma.templates.findMany({
        where: { id: { not: templateId } },
        orderBy: { views_last_24h: "desc" },
        take: 10,
      });
    }

    return prisma.$queryRaw<templates[]>`
      SELECT t.*
      FROM public.templates t
      WHERE t.id <> ${templateId}::uuid
        AND t.tags && ${tags}::text[]
      ORDER BY
        (
          SELECT COUNT(*)::int
          FROM (
            SELECT DISTINCT unnest(t.tags) AS tag
            INTERSECT
            SELECT DISTINCT unnest(${tags}::text[]) AS tag
          ) AS common
        ) DESC,
        t.views_last_24h DESC NULLS LAST,
        t.created_at DESC NULLS LAST,
        t.id ASC
      LIMIT 10
    `;
  },
);

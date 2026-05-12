import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/popular`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/newest`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tags`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.3,
    },
  ];

  const templates = await prisma.templates.findMany({
    select: { slug: true, updated_at: true, created_at: true },
    orderBy: { updated_at: "desc" },
  });

  const templateUrls: MetadataRoute.Sitemap = templates.map((t) => ({
    url: `${SITE_URL}/template/${t.slug}`,
    lastModified: t.updated_at ?? t.created_at ?? now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticUrls, ...templateUrls];
}

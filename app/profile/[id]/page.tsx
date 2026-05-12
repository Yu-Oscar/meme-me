import type { Metadata } from "next";
import { cache } from "react";
import { getUserTemplates } from "@/features/templates/queries/get-user-templates";
import TemplateList from "@/features/templates/components/TemplateList";
import Headings from "@/components/Headings";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getBookmarkedTemplateIds } from "@/features/bookmarks/queries/get-bookmarked-template-ids";
import { ProfileJsonLd } from "@/components/JsonLd";
import { prisma } from "@/lib/prisma";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const getProfileUser = cache(async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true },
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const profile = await getProfileUser(Number(id));
  const username = profile?.username ?? `用戶 #${id}`;
  const canonical = `/profile/${id}`;
  const title = `${username} | ${SITE_NAME}`;
  const description = `查看 ${username} 喺 ${SITE_NAME} 上載嘅meme template同梗圖作品。`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      siteName: SITE_NAME,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function AccountProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await getAuth();
  const [templates, bookmarkedTemplateIds, profile] = await Promise.all([
    getUserTemplates(Number(id)),
    user ? getBookmarkedTemplateIds(user.id) : Promise.resolve([]),
    getProfileUser(Number(id)),
  ]);

  const username =
    profile?.username ?? templates[0]?.user.username ?? `用戶 #${id}`;

  return (
    <div className="container mx-auto px-4 sm:px-20 py-8">
      <ProfileJsonLd
        name={username}
        url={`${SITE_URL}/profile/${id}`}
      />
      <Headings title={`#${id} ${username}`} />
      <TemplateList
        templates={templates}
        bookmarkedTemplateIds={bookmarkedTemplateIds}
      />
    </div>
  );
}
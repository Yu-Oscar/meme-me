import type { Metadata } from "next";
import Headings from "@/components/Headings";
import { SearchParams } from "nuqs/server";
import { searchParamsCache } from "@/features/templates/search-params";
import TemplateList from "@/features/templates/components/TemplateList";
import { getTemplates } from "@/features/templates/queries/get-templates";
import TemplatePagination from "@/features/templates/components/TemplatePagination";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getBookmarkedTemplateIds } from "@/features/bookmarks/queries/get-bookmarked-template-ids";
import { SITE_NAME } from "@/lib/site";

interface NewestTemplatesPageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: `最近更新 | ${SITE_NAME}`,
  description: `${SITE_NAME} 最新meme template同梗圖更新，新鮮出爐嘅香港本土迷因，等緊你嚟玩。`,
  alternates: { canonical: "/newest" },
  openGraph: {
    title: `最近更新 | ${SITE_NAME}`,
    description: `${SITE_NAME} 最新meme template同梗圖更新，新鮮出爐嘅香港本土迷因，等緊你嚟玩。`,
    url: "/newest",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `最近更新 | ${SITE_NAME}`,
    description: `${SITE_NAME} 最新meme template同梗圖更新，新鮮出爐嘅香港本土迷因，等緊你嚟玩。`,
  },
};

export default async function NewestTemplatesPage({
  searchParams,
}: NewestTemplatesPageProps) {
  const ParsedSearchParams = await searchParamsCache.parse(searchParams);
  const { user } = await getAuth();
  const [{ list, metadata }, bookmarkedTemplateIds] = await Promise.all([
    getTemplates(
      ParsedSearchParams,
      "created_at",
    ),
    user ? getBookmarkedTemplateIds(user.id) : Promise.resolve([]),
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-20 py-8">
      <Headings title="最近更新" />

      <TemplateList
        templates={list}
        bookmarkedTemplateIds={bookmarkedTemplateIds}
      />
      <TemplatePagination metadata={metadata}/>
    </div>
  );
}

import type { Metadata } from "next";
import Headings from "@/components/Headings";
import { SearchParams } from "nuqs/server";
import { searchParamsCache } from "@/features/templates/search-params";
import TemplateList from "@/features/templates/components/TemplateList";
import { getTemplates } from "@/features/templates/queries/get-templates";
import TemplatePagination from "@/features/templates/components/TemplatePagination";
import TemplateTabs from "@/features/templates/components/TemplateTabs";
import { sortOptionsType } from "@/features/templates/components/TemplateTabs";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getBookmarkedTemplateIds } from "@/features/bookmarks/queries/get-bookmarked-template-ids";
import { SITE_NAME } from "@/lib/site";

interface PopularTemplatesPageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: `熱門主題 | ${SITE_NAME}`,
  description: `${SITE_NAME} 熱門meme template排行榜：即時、本週、本月、全部時間最受歡迎嘅梗圖同迷因。`,
  alternates: { canonical: "/popular" },
  openGraph: {
    title: `熱門主題 | ${SITE_NAME}`,
    description: `${SITE_NAME} 熱門meme template排行榜：即時、本週、本月、全部時間最受歡迎嘅梗圖同迷因。`,
    url: "/popular",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `熱門主題 | ${SITE_NAME}`,
    description: `${SITE_NAME} 熱門meme template排行榜：即時、本週、本月、全部時間最受歡迎嘅梗圖同迷因。`,
  },
};

export const PopularSortOptions = [
  { value: "views_last_24h", label: "本日" },
  { value: "views_last_7d", label: "本週" },
  { value: "views_last_30d", label: "本月" },
  { value: "view_count", label: "全部時間" },
] as sortOptionsType; 

export default async function PopularTemplatesPage({
  searchParams,
}: PopularTemplatesPageProps) {
  const ParsedSearchParams = await searchParamsCache.parse(searchParams);
  const { user } = await getAuth();
  const [{ list, metadata }, bookmarkedTemplateIds] = await Promise.all([
    getTemplates(
      ParsedSearchParams,
      ParsedSearchParams.sort,
    ),
    user ? getBookmarkedTemplateIds(user.id) : Promise.resolve([]),
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-20 py-8">
      <Headings title="熱門主題" />
      <TemplateTabs sortOptions={PopularSortOptions} />
      <TemplateList
        templates={list}
        bookmarkedTemplateIds={bookmarkedTemplateIds}
      />
      <TemplatePagination metadata={metadata} />
    </div>
  );
}

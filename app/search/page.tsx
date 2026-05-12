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

export const SearchSortOptions = [
  { value: "views_last_24h", label: "即時熱門" },
  { value: "view_count", label: "全部時間" },
  { value: "created_at", label: "最新發布" },
] as sortOptionsType;

export async function generateMetadata({
  searchParams,
}: PopularTemplatesPageProps): Promise<Metadata> {
  const parsed = await searchParamsCache.parse(searchParams);
  const q = parsed.search?.trim() ?? "";
  const sort = parsed.sort;
  const hasQuery = q.length > 0;

  const title = hasQuery
    ? `「${q}」搜尋結果 | ${SITE_NAME}`
    : `搜尋 | ${SITE_NAME}`;
  const description = hasQuery
    ? `搜尋「${q}」嘅meme template同梗圖結果，搵到合心水嘅就立即整一張Meme出嚟。`
    : `喺 ${SITE_NAME} 搜尋你想要嘅meme template、梗圖、迷因。`;

  const canonicalParams = new URLSearchParams();
  if (hasQuery) canonicalParams.set("q", q);
  if (sort && sort !== "views_last_24h") canonicalParams.set("s", sort);
  const canonical = canonicalParams.toString()
    ? `/search?${canonicalParams.toString()}`
    : "/search";

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: hasQuery,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

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
      <Headings title={`${ParsedSearchParams.search}`} subtitle={`搜尋結果`} />
      <TemplateTabs sortOptions={SearchSortOptions} />
      <TemplateList
        templates={list}
        bookmarkedTemplateIds={bookmarkedTemplateIds}
      />
      <TemplatePagination metadata={metadata} />
    </div>
  );
}

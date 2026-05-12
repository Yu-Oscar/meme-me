import Headings from "@/components/Headings";
import { SearchParams } from "nuqs/server";
import { searchParamsCache } from "@/features/templates/search-params";
import TemplateList from "@/features/templates/components/TemplateList";
import { getTemplates } from "@/features/templates/queries/get-templates";
import TemplatePagination from "@/features/templates/components/TemplatePagination";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getBookmarkedTemplateIds } from "@/features/bookmarks/queries/get-bookmarked-template-ids";

interface NewestTemplatesPageProps {
  searchParams: Promise<SearchParams>;
}

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

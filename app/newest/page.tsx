import Headings from "@/components/Headings";
import Pagination from "@/features/templates/components/TemplatePagination";
import { SearchParams } from "nuqs/server";
import { searchParamsCache } from "@/features/templates/search-params";
import TemplateList from "@/features/templates/components/TemplateList";
import { getTemplates } from "@/features/templates/queries/get-templates";
import { templates } from "@/app/generated/prisma/client";
import TemplatePagination from "@/features/templates/components/TemplatePagination";

interface NewestTemplatesPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function NewestTemplatesPage({
  searchParams,
}: NewestTemplatesPageProps) {
  const ParsedSearchParams = await searchParamsCache.parse(searchParams);
  const { list, metadata } = await getTemplates(
    ParsedSearchParams,
    "created_at",
  );

  return (
    <div className="container mx-auto px-20 py-8">
      <Headings title="最近更新" />

      <TemplateList templates={list} />
      <TemplatePagination metadata={metadata}/>
    </div>
  );
}

"use client";
import { useQueryStates } from "nuqs";
import {
  paginationOptions,
  paginationParser,
} from "@/features/templates/search-params";
import { TEMPLATES_PAGE_SIZE } from "@/features/templates/templates-page-size";
import Pagination from "@/components/Pagination";

type TemplatePaginationProps = {
  metadata: {
    count: number;
    hasNextPage: boolean;
  };
}

export default function TemplatePagination({ metadata }: TemplatePaginationProps) {
  const [page, setPage] = useQueryStates(paginationParser, paginationOptions);
  return (
    <div className="w-full">
      <Pagination
        page={page}
        setPage={setPage}
        pageSize={TEMPLATES_PAGE_SIZE}
        metadata={metadata}
      />
    </div>
  );
}

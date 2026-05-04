"use client";
import { useQueryStates } from "nuqs";
import {
  paginationOptions,
  paginationParser,
} from "@/features/templates/search-params";
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
    <Pagination page={page} setPage={setPage} metadata={metadata}/>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type Page= {
  page: number;
};

type PaginationProps = {
  page: Page;
  setPage: (page: Page) => void;
  pageSize: number;
  metadata: {
    count: number;
    hasNextPage: boolean;
  };
  className?: string;
};

export default function Pagination({
  page,
  setPage,
  pageSize,
  metadata,
  className,
}: PaginationProps) {

    const WINDOW = 5;
    const lastPageIndex = Math.max(0, Math.ceil(metadata.count / pageSize) - 1);
    let start = page.page - Math.floor(WINDOW / 2);
    let end = start + WINDOW - 1;
    if (start < 0) {
      start = 0;
      end = Math.min(WINDOW - 1, lastPageIndex);
    }
    if (end > lastPageIndex) {
      end = lastPageIndex;
      start = Math.max(0, end - WINDOW + 1);
    }

    const handleNextPage = () => {
      setPage({ page: page.page + 1 });
    };
    const handlePreviousPage = () => {
      setPage({ page: page.page - 1 });
    };
    const handlePageClick = (page: number) => {
      setPage({ page });
    };

    const PreviousButton = (
      <Button variant="outline" onClick={handlePreviousPage} disabled={page.page === 0}>
        Previous
      </Button>
    );

    const NextButton = (
      <Button variant="outline" onClick={handleNextPage} disabled={!metadata.hasNextPage}>
        Next
      </Button>
    );

    const PageButtons = (
      <div className="flex flex-row gap-y-2 items-center gap-x-1">
        {Array.from({ length: end - start + 1 }, (_, index) => (
          <Button variant={page.page === start + index ? "default" : "outline"} key={index} onClick={() => handlePageClick(start + index)}>
            {start + index}
          </Button>
        ))}
      </div>
    );

  return (
    <div
      className={cn(
        "mt-4 flex w-full flex-row flex-wrap items-center justify-center gap-x-2 gap-y-2",
        className,
      )}
    >
      {PreviousButton}
      {PageButtons}
      {NextButton}
    </div>
  );
}
"use client";

import { Button } from "./ui/button";

type Page= {
  page: number;
};

type PaginationProps = {
  page: Page;
  setPage: (page: Page) => void;
  metadata: {
    count: number;
    hasNextPage: boolean;
  };
};

export default function Pagination({ page, setPage, metadata }: PaginationProps) {

    const handleNextPage = () => {
      setPage({ page: page.page + 1 });
    };
    const handlePreviousPage = () => {
      setPage({ page: page.page - 1 });
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

  return (
    <div className="flex flex-row gap-y-2 items-center w-full mt-4">
        {PreviousButton}
        {NextButton}
    </div>
  );
}
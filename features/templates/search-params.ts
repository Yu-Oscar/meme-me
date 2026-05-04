import { createSearchParamsCache, parseAsInteger } from "nuqs/server";

export const paginationParser = {
  page: parseAsInteger.withDefault(0),
};

export const paginationOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const searchParamsCache = createSearchParamsCache({
  ...paginationParser,
});

export type ParsedSearchParams = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;

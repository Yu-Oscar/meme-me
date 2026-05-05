import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";

export const paginationParser = {
  page: parseAsInteger.withDefault(0),
};

export const paginationOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const popularSortParser = {
  sort: parseAsString.withDefault("views_last_24h"),
};

export const popularSortOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const searchParamsCache = createSearchParamsCache({
  ...paginationParser,
  ...popularSortParser,
});

export type ParsedSearchParams = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;

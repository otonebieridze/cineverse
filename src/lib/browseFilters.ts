import { cacheLife } from "next/cache";

type SearchParamValue = string | string[] | undefined;

export const SORT_OPTIONS = [
  { value: "popularity", label: "Most popular" },
  { value: "rating", label: "Top rated" },
  { value: "release", label: "Newest releases" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortOption = "popularity";

export const MIN_RATING_OPTIONS = [5, 6, 7, 8] as const;

export const MIN_YEAR = 1900;

export type BrowseFilters = {
  genreIds: number[];
  sort: SortOption;
  fromYear: number | undefined;
  toYear: number | undefined;
  minRating: number | undefined;
};

export async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("hours");
  return new Date().getFullYear();
}

function parseInteger(value: SearchParamValue): number | undefined {
  return typeof value === "string" && /^\d+$/.test(value) ? Number(value) : undefined;
}

function parseGenreIds(value: SearchParamValue): number[] {
  if (typeof value !== "string") {
    return [];
  }
  const ids = value.split(",").flatMap((part) => parseInteger(part) ?? []);
  return [...new Set(ids)].toSorted((a, b) => a - b);
}

function parseYear(value: SearchParamValue, currentYear: number): number | undefined {
  const year = parseInteger(value);
  return year === undefined ? undefined : Math.min(Math.max(year, MIN_YEAR), currentYear);
}

export function parseBrowseFilters(
  searchParams: Record<string, SearchParamValue>,
  currentYear: number,
): BrowseFilters {
  const { genre, sort, from, to, rating } = searchParams;
  const fromYear = parseYear(from, currentYear);
  const toYear = parseYear(to, currentYear);
  const minRating = parseInteger(rating);
  const isReversed = fromYear !== undefined && toYear !== undefined && fromYear > toYear;

  return {
    genreIds: parseGenreIds(genre),
    sort: SORT_OPTIONS.find((option) => option.value === sort)?.value ?? DEFAULT_SORT,
    fromYear: isReversed ? toYear : fromYear,
    toYear: isReversed ? fromYear : toYear,
    minRating: MIN_RATING_OPTIONS.find((option) => option === minRating),
  };
}

export function toBrowseParams(filters: BrowseFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.genreIds.length > 0) {
    params.genre = filters.genreIds.join(",");
  }
  if (filters.sort !== DEFAULT_SORT) {
    params.sort = filters.sort;
  }
  if (filters.fromYear !== undefined) {
    params.from = String(filters.fromYear);
  }
  if (filters.toYear !== undefined) {
    params.to = String(filters.toYear);
  }
  if (filters.minRating !== undefined) {
    params.rating = String(filters.minRating);
  }
  return params;
}

export function toBrowseHref(filters: BrowseFilters): string {
  const query = new URLSearchParams(toBrowseParams(filters)).toString();
  return query ? `/movies?${query}` : "/movies";
}

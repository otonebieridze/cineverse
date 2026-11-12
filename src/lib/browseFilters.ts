type SearchParamValue = string | string[] | undefined;

export type BrowseFilters = {
  genreId: number | undefined;
};

export function parseBrowseFilters(searchParams: Record<string, SearchParamValue>): BrowseFilters {
  const { genre } = searchParams;
  return {
    genreId: typeof genre === "string" && /^\d+$/.test(genre) ? Number(genre) : undefined,
  };
}

export function toBrowseParams(filters: BrowseFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.genreId !== undefined) {
    params.genre = String(filters.genreId);
  }
  return params;
}

export function toBrowseHref(filters: BrowseFilters): string {
  const query = new URLSearchParams(toBrowseParams(filters)).toString();
  return query ? `/movies?${query}` : "/movies";
}

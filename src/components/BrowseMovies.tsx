import { BrowseFiltersForm } from "@/components/BrowseFiltersForm";
import { GenreFilter } from "@/components/GenreFilter";
import { MovieResults } from "@/components/MovieResults";
import { MovieSection } from "@/components/MovieSection";
import { Pagination } from "@/components/Pagination";
import { type BrowseFilters, DEFAULT_SORT, SORT_OPTIONS, toBrowseParams } from "@/lib/browseFilters";
import { loadPage } from "@/lib/pagination";
import { discoverMovies, getMovieGenres } from "@/lib/tmdb";

type BrowseMoviesProps = {
  filters: BrowseFilters;
  page: number;
  currentYear: number;
};

export async function BrowseMovies({ filters, page, currentYear }: BrowseMoviesProps) {
  const [{ genres }, discovered] = await Promise.all([
    getMovieGenres(),
    loadPage((target) => discoverMovies(filters, target), page),
  ]);
  const activeGenres = genres.filter((genre) => filters.genreIds.includes(genre.id));
  const activeFilters: BrowseFilters = {
    ...filters,
    genreIds: activeGenres.map((genre) => genre.id).toSorted((a, b) => a - b),
  };

  const result =
    activeGenres.length !== filters.genreIds.length
      ? await loadPage((target) => discoverMovies(activeFilters, target), page)
      : discovered;

  const genreLabel = activeGenres.map((genre) => genre.name).join(" + ");
  const sortLabel =
    filters.sort === DEFAULT_SORT
      ? undefined
      : SORT_OPTIONS.find((option) => option.value === filters.sort)?.label;
  const title = [genreLabel, sortLabel].filter(Boolean).join(" · ") || "Popular movies";

  return (
    <>
      <div className="space-y-4">
        <GenreFilter genres={genres} filters={activeFilters} />
        <BrowseFiltersForm filters={activeFilters} currentYear={currentYear} />
      </div>
      <MovieSection id="browse-results" title={title}>
        <MovieResults
          movies={result.data.results}
          emptyMessage="No movies match these filters."
          aboveTheFold
        />
        <Pagination
          pathname="/movies"
          params={toBrowseParams(activeFilters)}
          page={result.page}
          totalPages={result.totalPages}
        />
      </MovieSection>
    </>
  );
}

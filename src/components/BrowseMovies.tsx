import { GenreFilter } from "@/components/GenreFilter";
import { MovieResults } from "@/components/MovieResults";
import { MovieSection } from "@/components/MovieSection";
import { Pagination } from "@/components/Pagination";
import { type BrowseFilters, toBrowseParams } from "@/lib/browseFilters";
import { loadPage } from "@/lib/pagination";
import { discoverMovies, getMovieGenres } from "@/lib/tmdb";

type BrowseMoviesProps = {
  filters: BrowseFilters;
  page: number;
};

export async function BrowseMovies({ filters, page }: BrowseMoviesProps) {
  const [{ genres }, discovered] = await Promise.all([
    getMovieGenres(),
    loadPage((target) => discoverMovies(filters, target), page),
  ]);
  const activeGenre = genres.find((genre) => genre.id === filters.genreId);
  const activeFilters: BrowseFilters = { ...filters, genreId: activeGenre?.id };

  // An unknown genre id falls back to "All".
  const result =
    filters.genreId !== undefined && !activeGenre
      ? await loadPage((target) => discoverMovies(activeFilters, target), page)
      : discovered;

  return (
    <>
      <GenreFilter genres={genres} filters={activeFilters} />
      <MovieSection
        id="browse-results"
        title={activeGenre?.name ?? "Popular movies"}
      >
        <MovieResults
          movies={result.data.results}
          emptyMessage="No movies found for this genre."
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

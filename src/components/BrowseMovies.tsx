import { GenreFilter } from "@/components/GenreFilter";
import { MovieResults } from "@/components/MovieResults";
import { MovieSection } from "@/components/MovieSection";
import { Pagination } from "@/components/Pagination";
import { loadPage } from "@/lib/pagination";
import { discoverMovies, getMovieGenres } from "@/lib/tmdb";

type BrowseMoviesProps = {
  genreId: number | undefined;
  page: number;
};

export async function BrowseMovies({ genreId, page }: BrowseMoviesProps) {
  const [{ genres }, discovered] = await Promise.all([
    getMovieGenres(),
    loadPage((target) => discoverMovies(genreId, target), page),
  ]);
  const activeGenre = genres.find((genre) => genre.id === genreId);

  // An unknown genre id falls back to "All".
  const result =
    genreId !== undefined && !activeGenre
      ? await loadPage((target) => discoverMovies(undefined, target), page)
      : discovered;

  return (
    <>
      <GenreFilter genres={genres} activeGenreId={activeGenre?.id} />
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
          params={activeGenre ? { genre: String(activeGenre.id) } : undefined}
          page={result.page}
          totalPages={result.totalPages}
        />
      </MovieSection>
    </>
  );
}

import { GenreFilter } from "@/components/GenreFilter";
import { MovieResults } from "@/components/MovieResults";
import { MovieSection } from "@/components/MovieSection";
import { discoverMovies, getMovieGenres } from "@/lib/tmdb";

type BrowseMoviesProps = {
  genreId: number | undefined;
};

export async function BrowseMovies({ genreId }: BrowseMoviesProps) {
  const [{ genres }, discovered] = await Promise.all([
    getMovieGenres(),
    discoverMovies(genreId),
  ]);
  const activeGenre = genres.find((genre) => genre.id === genreId);

  const { results } =
    genreId !== undefined && !activeGenre ? await discoverMovies() : discovered;

  return (
    <>
      <GenreFilter genres={genres} activeGenreId={activeGenre?.id} />
      <MovieSection
        id="browse-results"
        title={activeGenre?.name ?? "Popular movies"}
      >
        <MovieResults
          movies={results}
          emptyMessage="No movies found for this genre."
          aboveTheFold
        />
      </MovieSection>
    </>
  );
}

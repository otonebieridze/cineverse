import { MOVIES_PER_SECTION } from "@/components/MovieList";
import { MovieResults } from "@/components/MovieResults";
import { MovieSection } from "@/components/MovieSection";
import type { Movie, PaginatedResponse } from "@/types/tmdb";

type RecommendedMoviesProps = {
  recommendationsPromise: Promise<PaginatedResponse<Movie> | null>;
};

export async function RecommendedMovies({ recommendationsPromise }: RecommendedMoviesProps) {
  const recommendations = await recommendationsPromise;
  const movies = recommendations?.results.slice(0, MOVIES_PER_SECTION) ?? [];

  if (movies.length === 0) {
    return null;
  }

  return (
    <MovieSection id="recommendations" title="You might also like">
      <MovieResults movies={movies} emptyMessage="No recommendations available." />
    </MovieSection>
  );
}

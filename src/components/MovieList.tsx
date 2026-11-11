import { MovieResults } from "@/components/MovieResults";
import type { Movie, PaginatedResponse } from "@/types/tmdb";

export const MOVIES_PER_SECTION = 12;

type MovieListProps = {
  loadMovies: () => Promise<PaginatedResponse<Movie>>;
};

export async function MovieList({ loadMovies }: MovieListProps) {
  const { results } = await loadMovies();

  return (
    <MovieResults
      movies={results.slice(0, MOVIES_PER_SECTION)}
      emptyMessage="No movies to show right now."
    />
  );
}

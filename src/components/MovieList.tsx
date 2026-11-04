import { MovieCard } from "@/components/MovieCard";
import { GRID_MAX_COLUMNS, GRID_MIN_COLUMNS, MovieGrid } from "@/components/MovieGrid";
import type { Movie, PaginatedResponse } from "@/types/tmdb";

export const MOVIES_PER_SECTION = 12;

type MovieListProps = {
  loadMovies: () => Promise<PaginatedResponse<Movie>>;
  aboveTheFold?: boolean;
};

export async function MovieList({ loadMovies, aboveTheFold = false }: MovieListProps) {
  const { results } = await loadMovies();
  const movies = results.slice(0, MOVIES_PER_SECTION);

  if (movies.length === 0) {
    return <p className="text-muted">No movies to show right now.</p>;
  }

  return (
    <MovieGrid>
      {movies.map((movie, index) => (
        <li key={movie.id}>
          <MovieCard
            movie={movie}
            loading={aboveTheFold && index < GRID_MAX_COLUMNS ? "eager" : undefined}
            fetchPriority={aboveTheFold && index < GRID_MIN_COLUMNS ? "high" : undefined}
          />
        </li>
      ))}
    </MovieGrid>
  );
}

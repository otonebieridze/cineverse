import { MovieCard } from "@/components/MovieCard";
import { GRID_MAX_COLUMNS, GRID_MIN_COLUMNS, MovieGrid } from "@/components/MovieGrid";
import type { Movie } from "@/types/tmdb";

type MovieResultsProps = {
  movies: Movie[];
  emptyMessage: string;
  aboveTheFold?: boolean;
};

export function MovieResults({ movies, emptyMessage, aboveTheFold = false }: MovieResultsProps) {
  if (movies.length === 0) {
    return <p className="text-muted">{emptyMessage}</p>;
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

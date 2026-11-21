import { MOVIES_PER_SECTION } from "@/components/MovieList";
import { MovieResults } from "@/components/MovieResults";
import { MovieSection } from "@/components/MovieSection";
import { selectKnownForMovies } from "@/lib/knownFor";
import type { PersonMovieCredits } from "@/types/tmdb";

type KnownForMoviesProps = {
  creditsPromise: Promise<PersonMovieCredits | null>;
};

export async function KnownForMovies({ creditsPromise }: KnownForMoviesProps) {
  const credits = await creditsPromise;
  const movies = selectKnownForMovies(credits?.cast ?? [], MOVIES_PER_SECTION);

  if (movies.length === 0) {
    return null;
  }

  return (
    <MovieSection id="known-for" title="Known for">
      <MovieResults movies={movies} emptyMessage="No movies available." />
    </MovieSection>
  );
}

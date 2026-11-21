import type { PersonMovieCredit } from "@/types/tmdb";

export function selectKnownForMovies(
  cast: PersonMovieCredit[],
  limit: number,
): PersonMovieCredit[] {
  const seen = new Set<number>();
  const movies = cast.filter((credit) => {
    if (credit.adult || seen.has(credit.id)) {
      return false;
    }
    seen.add(credit.id);
    return true;
  });

  return movies.toSorted((a, b) => b.vote_count - a.vote_count).slice(0, limit);
}

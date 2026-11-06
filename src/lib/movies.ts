import type { MovieSummary } from "@/types/tmdb";

export function toMovieSummary({
  id,
  title,
  poster_path,
  release_date,
  vote_average,
}: MovieSummary): MovieSummary {
  return { id, title, poster_path, release_date, vote_average };
}

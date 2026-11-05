import { MovieResults } from "@/components/MovieResults";
import { searchMovies } from "@/lib/tmdb";

type SearchResultsProps = {
  query: string;
};

export async function SearchResults({ query }: SearchResultsProps) {
  const { results } = await searchMovies(query);

  return (
    <MovieResults
      movies={results}
      emptyMessage={`No movies found for "${query}".`}
      aboveTheFold
    />
  );
}

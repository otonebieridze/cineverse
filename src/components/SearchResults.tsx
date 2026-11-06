import { MovieResults } from "@/components/MovieResults";
import { Pagination } from "@/components/Pagination";
import { loadPage } from "@/lib/pagination";
import { searchMovies } from "@/lib/tmdb";

type SearchResultsProps = {
  query: string;
  page: number;
};

export async function SearchResults({ query, page }: SearchResultsProps) {
  const result = await loadPage((target) => searchMovies(query, target), page);

  return (
    <>
      <MovieResults
        movies={result.data.results}
        emptyMessage={`No movies found for "${query}".`}
        aboveTheFold
      />
      <Pagination
        pathname="/search"
        params={{ q: query }}
        page={result.page}
        totalPages={result.totalPages}
      />
    </>
  );
}

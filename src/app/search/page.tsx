import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";
import { MovieSection } from "@/components/MovieSection";
import { SearchForm } from "@/components/SearchForm";
import { SearchResults } from "@/components/SearchResults";
import { parsePage } from "@/lib/pagination";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Container className="space-y-10 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Search movies</h1>

      <Suspense fallback={<MovieGridSkeleton />}>
        {searchParams.then(({ q, page }) => {
          const query = typeof q === "string" ? q.trim() : "";
          const currentPage = parsePage(page);

          return (
            <>
              <SearchForm query={query} />
              {query ? (
                <MovieSection id="search-results" title={`Results for "${query}"`}>
                  <Suspense key={`${query}:${currentPage}`} fallback={<MovieGridSkeleton />}>
                    <SearchResults query={query} page={currentPage} />
                  </Suspense>
                </MovieSection>
              ) : (
                <p className="text-muted">Start typing to search for a movie.</p>
              )}
            </>
          );
        })}
      </Suspense>
    </Container>
  );
}

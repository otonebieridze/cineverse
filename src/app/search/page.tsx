import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";
import { MovieSection } from "@/components/MovieSection";
import { SearchForm } from "@/components/SearchForm";
import { SearchResults } from "@/components/SearchResults";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Container className="space-y-10 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Search movies</h1>

      <Suspense fallback={<MovieGridSkeleton />}>
        {searchParams.then(({ q }) => {
          const query = typeof q === "string" ? q.trim() : "";

          return (
            <>
              <SearchForm defaultValue={query} />
              {query ? (
                <MovieSection id="search-results" title={`Results for "${query}"`}>
                  <Suspense key={query} fallback={<MovieGridSkeleton />}>
                    <SearchResults query={query} />
                  </Suspense>
                </MovieSection>
              ) : (
                <p className="text-muted">Enter a movie title and press Search.</p>
              )}
            </>
          );
        })}
      </Suspense>
    </Container>
  );
}

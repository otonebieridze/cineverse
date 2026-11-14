import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseMovies } from "@/components/BrowseMovies";
import { Container } from "@/components/Container";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";
import { getCurrentYear, parseBrowseFilters } from "@/lib/browseFilters";
import { parsePage } from "@/lib/pagination";

export const metadata: Metadata = {
  title: "Browse",
};

export default function MoviesPage({ searchParams }: PageProps<"/movies">) {
  return (
    <Container className="space-y-10 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse movies</h1>

      <Suspense fallback={<MovieGridSkeleton />}>
        {Promise.all([searchParams, getCurrentYear()]).then(([params, currentYear]) => (
          <BrowseMovies
            filters={parseBrowseFilters(params, currentYear)}
            page={parsePage(params.page)}
            currentYear={currentYear}
          />
        ))}
      </Suspense>
    </Container>
  );
}

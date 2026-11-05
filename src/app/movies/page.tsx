import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseMovies } from "@/components/BrowseMovies";
import { Container } from "@/components/Container";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";

export const metadata: Metadata = {
  title: "Browse",
};

export default function MoviesPage({ searchParams }: PageProps<"/movies">) {
  return (
    <Container className="space-y-10 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse movies</h1>

      <Suspense fallback={<MovieGridSkeleton />}>
        {searchParams.then(({ genre }) => (
          <BrowseMovies
            genreId={typeof genre === "string" && /^\d+$/.test(genre) ? Number(genre) : undefined}
          />
        ))}
      </Suspense>
    </Container>
  );
}

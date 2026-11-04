import { Suspense } from "react";
import { Container } from "@/components/Container";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";
import { MovieList } from "@/components/MovieList";
import { MovieSection } from "@/components/MovieSection";
import { getPopularMovies, getTrendingMovies } from "@/lib/tmdb";

export default function Home() {
  return (
    <Container className="space-y-14 py-12 sm:py-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Discover movies
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          Browse what&apos;s trending and popular right now.
        </p>
      </div>

      <MovieSection id="trending" title="Trending this week">
        <Suspense fallback={<MovieGridSkeleton />}>
          <MovieList loadMovies={getTrendingMovies} aboveTheFold />
        </Suspense>
      </MovieSection>

      <MovieSection id="popular" title="Popular">
        <Suspense fallback={<MovieGridSkeleton />}>
          <MovieList loadMovies={getPopularMovies} />
        </Suspense>
      </MovieSection>
    </Container>
  );
}

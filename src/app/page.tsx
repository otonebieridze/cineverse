import { Suspense } from "react";
import { Container } from "@/components/Container";
import { HeroBanner } from "@/components/HeroBanner";
import { HeroBannerSkeleton } from "@/components/HeroBannerSkeleton";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";
import { MovieList } from "@/components/MovieList";
import { MovieSection } from "@/components/MovieSection";
import { getPopularMovies, getTrendingMovies } from "@/lib/tmdb";

export default function Home() {
  return (
    <>
      <h1 className="sr-only">Discover movies</h1>

      <Suspense fallback={<HeroBannerSkeleton />}>
        <HeroBanner />
      </Suspense>

      <Container className="space-y-14 py-12 sm:py-16">
        <MovieSection id="trending" title="Trending this week">
          <Suspense fallback={<MovieGridSkeleton />}>
            <MovieList loadMovies={getTrendingMovies} />
          </Suspense>
        </MovieSection>

        <MovieSection id="popular" title="Popular">
          <Suspense fallback={<MovieGridSkeleton />}>
            <MovieList loadMovies={getPopularMovies} />
          </Suspense>
        </MovieSection>
      </Container>
    </>
  );
}

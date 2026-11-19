import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CastList } from "@/components/CastList";
import { CastListSkeleton } from "@/components/CastListSkeleton";
import { Container } from "@/components/Container";
import { MovieDetails } from "@/components/MovieDetails";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";
import { RecommendedMovies } from "@/components/RecommendedMovies";
import { TrailerSection } from "@/components/TrailerSection";
import { TrailerSectionSkeleton } from "@/components/TrailerSectionSkeleton";
import { getImageUrl } from "@/lib/images";
import { SHARED_OPEN_GRAPH } from "@/lib/siteMetadata";
import {
  getMovieCredits,
  getMovieDetails,
  getMovieRecommendations,
  getMovieVideos,
} from "@/lib/tmdb";

export async function generateMetadata({
  params,
}: PageProps<"/movie/[id]">): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  if (!movie) {
    return { title: "Movie not found" };
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, "w1280");

  return {
    title: movie.title,
    description: movie.overview,
    openGraph: {
      ...SHARED_OPEN_GRAPH,
      type: "video.movie",
      title: movie.title,
      description: movie.overview,
      url: `/movie/${movie.id}`,
      images: backdropUrl
        ? [{ url: backdropUrl, width: 1280, height: 720, alt: `Scene from ${movie.title}` }]
        : undefined,
    },
  };
}

export default async function MoviePage({ params }: PageProps<"/movie/[id]">) {
  const { id } = await params;
  const creditsPromise = getMovieCredits(id).catch(() => null);
  const videosPromise = getMovieVideos(id).catch(() => null);
  const recommendationsPromise = getMovieRecommendations(id).catch(() => null);
  const movie = await getMovieDetails(id);

  if (!movie) {
    notFound();
  }

  return (
    <>
      <MovieDetails movie={movie} />
      <Container className="space-y-14 pb-12 sm:pb-16">
        <Suspense fallback={<TrailerSectionSkeleton />}>
          <TrailerSection
            videosPromise={videosPromise}
            movieTitle={movie.title}
            backdropPath={movie.backdrop_path}
          />
        </Suspense>
        <Suspense fallback={<CastListSkeleton />}>
          <CastList creditsPromise={creditsPromise} />
        </Suspense>
        <Suspense fallback={<MovieGridSkeleton />}>
          <RecommendedMovies recommendationsPromise={recommendationsPromise} />
        </Suspense>
      </Container>
    </>
  );
}

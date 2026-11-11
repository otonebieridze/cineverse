import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CastList } from "@/components/CastList";
import { CastListSkeleton } from "@/components/CastListSkeleton";
import { Container } from "@/components/Container";
import { MovieDetails } from "@/components/MovieDetails";
import { getMovieCredits, getMovieDetails } from "@/lib/tmdb";

export async function generateMetadata({
  params,
}: PageProps<"/movie/[id]">): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  if (!movie) {
    return { title: "Movie not found" };
  }

  return { title: movie.title, description: movie.overview };
}

export default async function MoviePage({ params }: PageProps<"/movie/[id]">) {
  const { id } = await params;
  const creditsPromise = getMovieCredits(id).catch(() => null);
  const movie = await getMovieDetails(id);

  if (!movie) {
    notFound();
  }

  return (
    <>
      <MovieDetails movie={movie} />
      <Container className="space-y-14 pb-12 sm:pb-16">
        <Suspense fallback={<CastListSkeleton />}>
          <CastList creditsPromise={creditsPromise} />
        </Suspense>
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MovieDetails } from "@/components/MovieDetails";
import { getMovieDetails } from "@/lib/tmdb";

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
  const movie = await getMovieDetails(id);

  if (!movie) {
    notFound();
  }

  return <MovieDetails movie={movie} />;
}

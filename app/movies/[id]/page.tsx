import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMovieById, sampleMovies } from "@/lib/sample-movies";

export function generateStaticParams() {
  return sampleMovies.map((movie) => ({ id: movie.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = getMovieById(id);

  return { title: movie?.title ?? "Movie not found" };
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = getMovieById(id);

  if (!movie) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16 sm:flex-row">
      <div className="relative aspect-2/3 w-full max-w-xs shrink-0 overflow-hidden rounded-lg bg-surface">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-3 text-center text-sm text-muted-foreground">
            {movie.title}
          </div>
        )}
      </div>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {movie.title}
        </h1>
        <div className="mt-2 flex items-center gap-3 text-muted-foreground">
          <span>{movie.releaseYear}</span>
          <span className="text-accent">★ {movie.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

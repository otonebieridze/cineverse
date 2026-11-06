import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getImageUrl } from "@/lib/tmdb";
import { toFavoriteMovie } from "@/stores/useFavoritesStore";
import type { Movie } from "@/types/tmdb";

type MovieCardProps = {
  movie: Movie;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "auto";
};

export function MovieCard({ movie, loading, fetchPriority }: MovieCardProps) {
  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const year = movie.release_date.slice(0, 4);
  const rating = movie.vote_average.toFixed(1);

  return (
    <article className="group relative">
      <div className="relative aspect-2/3 overflow-hidden rounded-card bg-surface shadow-card">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`Poster for ${movie.title}`}
            fill
            sizes="(min-width: 1280px) 200px, (min-width: 1024px) 16vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
            loading={loading}
            fetchPriority={fetchPriority}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted">
            No poster available
          </div>
        )}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton movie={toFavoriteMovie(movie)} variant="icon" />
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-accent">
        <Link
          href={`/movie/${movie.id}`}
          className="outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
        >
          {movie.title}
        </Link>
      </h3>
      <p className="mt-1 flex gap-2 text-sm text-muted">
        {year && <span>{year}</span>}
        {movie.vote_average > 0 && (
          <span aria-label={`Rated ${rating} out of 10`}>
            <span aria-hidden="true" className="text-accent">★</span> {rating}
          </span>
        )}
      </p>
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/movie";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="overflow-hidden rounded-lg bg-surface transition-opacity hover:opacity-80"
    >
      <div className="relative aspect-2/3 w-full bg-white/5">
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
      <div className="p-3">
        <h3 className="truncate text-sm font-medium">{movie.title}</h3>
        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{movie.releaseYear}</span>
          <span className="text-accent">★ {movie.rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}

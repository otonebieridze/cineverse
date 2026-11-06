import Image from "next/image";
import { Container } from "@/components/Container";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getImageUrl } from "@/lib/images";
import { toFavoriteMovie } from "@/stores/useFavoritesStore";
import type { MovieDetails as MovieDetailsData } from "@/types/tmdb";

type MovieDetailsProps = {
  movie: MovieDetailsData;
};

function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return [hours > 0 && `${hours}h`, rest > 0 && `${rest}m`].filter(Boolean).join(" ");
}

export function MovieDetails({ movie }: MovieDetailsProps) {
  const backdropUrl = getImageUrl(movie.backdrop_path, "w1280");
  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const year = movie.release_date.slice(0, 4);
  const rating = movie.vote_average.toFixed(1);

  return (
    <article className="relative isolate overflow-hidden">
      {backdropUrl && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={backdropUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/20" />
        </div>
      )}

      <Container className="flex flex-col gap-8 py-12 sm:py-16 md:flex-row md:items-start md:gap-12">
        <div className="relative aspect-2/3 w-48 shrink-0 overflow-hidden rounded-card bg-surface shadow-card sm:w-56 md:w-72">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`Poster for ${movie.title}`}
              fill
              sizes="(min-width: 768px) 18rem, (min-width: 640px) 14rem, 12rem"
              className="object-cover"
              loading="eager"
              fetchPriority={backdropUrl ? undefined : "high"}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted">
              No poster available
            </div>
          )}
        </div>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {movie.title}
          </h1>
          {movie.tagline && <p className="mt-3 text-lg text-muted italic">{movie.tagline}</p>}

          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-muted">
            {year && <span>{year}</span>}
            {movie.runtime ? <span>{formatRuntime(movie.runtime)}</span> : null}
            {movie.vote_average > 0 && (
              <span aria-label={`Rated ${rating} out of 10`}>
                <span aria-hidden="true" className="text-accent">★</span> {rating}
              </span>
            )}
          </p>

          <div className="mt-6">
            <FavoriteButton movie={toFavoriteMovie(movie)} variant="labeled" />
          </div>

          {movie.genres.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Genres">
              {movie.genres.map((genre) => (
                <li
                  key={genre.id}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-sm"
                >
                  {genre.name}
                </li>
              ))}
            </ul>
          )}

          <h2 className="mt-8 text-xl font-semibold">Overview</h2>
          <p className="mt-3 leading-relaxed text-foreground/90">
            {movie.overview || "No overview available."}
          </p>
        </div>
      </Container>
    </article>
  );
}

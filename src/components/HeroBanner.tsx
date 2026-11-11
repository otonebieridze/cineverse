import Image from "next/image";
import Link from "next/link";
import { ACCENT_BUTTON_CLASS_NAME } from "@/components/Button";
import { Container } from "@/components/Container";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getImageUrl } from "@/lib/images";
import { toMovieSummary } from "@/lib/movies";
import { getTrendingMovies } from "@/lib/tmdb";

export async function HeroBanner() {
  const { results } = await getTrendingMovies();
  const movie = results.find((result) => result.backdrop_path);
  const backdropUrl = movie && getImageUrl(movie.backdrop_path, "w1280");

  if (!movie || !backdropUrl) {
    return null;
  }

  const year = movie.release_date.slice(0, 4);
  const rating = movie.vote_average.toFixed(1);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-112 items-end overflow-hidden sm:min-h-128 lg:min-h-160"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src={backdropUrl}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-background/80 to-transparent" />
      </div>

      <Container className="pt-24 pb-10 sm:pb-14 lg:pb-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">
            #1 trending this week
          </p>
          <h2
            id="hero-heading"
            className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            {movie.title}
          </h2>

          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-muted">
            {year && <span>{year}</span>}
            {movie.vote_average > 0 && (
              <span aria-label={`Rated ${rating} out of 10`}>
                <span aria-hidden="true" className="text-accent">★</span> {rating}
              </span>
            )}
          </p>

          {movie.overview && (
            <p className="mt-4 line-clamp-3 leading-relaxed text-foreground/90 sm:text-lg">
              {movie.overview}
            </p>
          )}

          <div className="mt-8 flex items-center gap-3">
            <Link
              href={`/movie/${movie.id}`}
              className={`${ACCENT_BUTTON_CLASS_NAME} inline-flex items-center px-6 py-3`}
            >
              View details
            </Link>
            <FavoriteButton movie={toMovieSummary(movie)} variant="icon" />
          </div>
        </div>
      </Container>
    </section>
  );
}

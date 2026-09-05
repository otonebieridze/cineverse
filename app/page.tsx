import MovieCard from "@/components/movie/MovieCard";
import { sampleMovies } from "@/lib/sample-movies";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Discover your next favorite movie
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Browse popular, trending, and upcoming titles, explore details, and
          build your watchlist — all in one place.
        </p>
      </div>

      <div className="mx-auto mt-16 grid w-full max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {sampleMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

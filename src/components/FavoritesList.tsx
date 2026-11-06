"use client";

import Link from "next/link";
import { MovieCard } from "@/components/MovieCard";
import { MovieGrid } from "@/components/MovieGrid";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";
import { useFavoritesHydrated, useFavoritesStore } from "@/stores/useFavoritesStore";

export function FavoritesList() {
  const hydrated = useFavoritesHydrated();
  const favorites = useFavoritesStore((state) => state.favorites);

  if (!hydrated) {
    return <MovieGridSkeleton />;
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted">
          You haven&apos;t saved any movies yet. Tap the heart on a movie to add it here.
        </p>
        <Link
          href="/movies"
          className="rounded-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          Browse movies
        </Link>
      </div>
    );
  }

  return (
    <MovieGrid>
      {favorites.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </MovieGrid>
  );
}

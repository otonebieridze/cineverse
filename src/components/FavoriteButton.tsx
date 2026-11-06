"use client";

import { Button } from "@/components/Button";
import { HeartIcon } from "@/components/HeartIcon";
import { useFavoritesStore, useIsFavorite } from "@/stores/useFavoritesStore";
import type { MovieSummary } from "@/types/tmdb";

type FavoriteButtonProps = {
  movie: MovieSummary;
  variant: "icon" | "labeled";
};

export function FavoriteButton({ movie, variant }: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(movie.id);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  if (variant === "labeled") {
    return (
      <Button
        onClick={() => toggleFavorite(movie)}
        className="inline-flex items-center gap-2 px-5 py-2.5"
      >
        <HeartIcon filled={isFavorite} className="size-5" />
        <span className="grid">
          <span className={`col-start-1 row-start-1 ${isFavorite ? "invisible" : ""}`}>
            Add to favorites
          </span>
          <span className={`col-start-1 row-start-1 ${isFavorite ? "" : "invisible"}`}>
            Remove from favorites
          </span>
        </span>
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Favorite ${movie.title}`}
      aria-pressed={isFavorite}
      onClick={() => toggleFavorite(movie)}
      className={`flex size-10 items-center justify-center rounded-full bg-background/70 backdrop-blur transition-colors hover:bg-background/90 ${
        isFavorite ? "text-accent" : "text-foreground hover:text-accent"
      }`}
    >
      <HeartIcon filled={isFavorite} className="size-5" />
    </button>
  );
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Movie } from "@/types/tmdb";

export type FavoriteMovie = Pick<
  Movie,
  "id" | "title" | "poster_path" | "release_date" | "vote_average"
>;

type FavoritesState = {
  favorites: FavoriteMovie[];
  toggleFavorite: (movie: FavoriteMovie) => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (movie) =>
        set(({ favorites }) => ({
          favorites: favorites.some(({ id }) => id === movie.id)
            ? favorites.filter(({ id }) => id !== movie.id)
            : [movie, ...favorites],
        })),
    }),
    {
      name: "cineverse-favorites",
      partialize: ({ favorites }) => ({ favorites }),
      skipHydration: true,
    },
  ),
);

export function toFavoriteMovie({
  id,
  title,
  poster_path,
  release_date,
  vote_average,
}: FavoriteMovie): FavoriteMovie {
  return { id, title, poster_path, release_date, vote_average };
}

export function useIsFavorite(id: number): boolean {
  return useFavoritesStore(({ favorites }) => favorites.some((movie) => movie.id === id));
}

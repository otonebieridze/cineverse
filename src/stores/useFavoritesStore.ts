import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MovieSummary } from "@/types/tmdb";

type FavoritesState = {
  favorites: MovieSummary[];
  toggleFavorite: (movie: MovieSummary) => void;
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

export function useIsFavorite(id: number): boolean {
  return useFavoritesStore(({ favorites }) => favorites.some((movie) => movie.id === id));
}

function subscribeToHydration(onChange: () => void) {
  return useFavoritesStore.persist.onFinishHydration(onChange);
}

function getHasHydrated() {
  return useFavoritesStore.persist.hasHydrated();
}

export function useFavoritesHydrated(): boolean {
  return useSyncExternalStore(subscribeToHydration, getHasHydrated, () => false);
}

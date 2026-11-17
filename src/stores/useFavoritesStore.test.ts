import { beforeEach, describe, expect, it } from "vitest";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import type { MovieSummary } from "@/types/tmdb";

const STORAGE_KEY = "cineverse-favorites";

function movie(id: number, title = `Movie ${id}`): MovieSummary {
  return { id, title, poster_path: null, release_date: "2010-07-16", vote_average: 8.4 };
}

function favorites() {
  return useFavoritesStore.getState().favorites;
}

function toggle(target: MovieSummary) {
  useFavoritesStore.getState().toggleFavorite(target);
}

function readStorage(): unknown {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === null ? null : JSON.parse(raw);
}

// The store is a module-level singleton, so every test starts from a clean slate.
beforeEach(() => {
  useFavoritesStore.setState({ favorites: [] });
  localStorage.clear();
});

describe("toggleFavorite", () => {
  it("adds a movie that is not a favorite yet", () => {
    toggle(movie(1));

    expect(favorites()).toEqual([movie(1)]);
  });

  it("removes a movie that is already a favorite", () => {
    toggle(movie(1));
    toggle(movie(1));

    expect(favorites()).toEqual([]);
  });

  it("puts the newest favorite first", () => {
    toggle(movie(1));
    toggle(movie(2));
    toggle(movie(3));

    expect(favorites().map(({ id }) => id)).toEqual([3, 2, 1]);
  });

  it("matches movies by id, so the same movie is never added twice", () => {
    toggle(movie(1, "Inception"));
    toggle(movie(1, "Inception (copy with a different title)"));

    expect(favorites()).toEqual([]);
  });

  it("keeps the order of the other favorites when one is removed", () => {
    toggle(movie(1));
    toggle(movie(2));
    toggle(movie(3));

    toggle(movie(2));

    expect(favorites().map(({ id }) => id)).toEqual([3, 1]);
  });
});

describe("persistence", () => {
  // Changing this key or shape would silently lose every user's saved favorites.
  it("saves favorites to localStorage under a stable key and shape", () => {
    toggle(movie(1));

    expect(readStorage()).toEqual({ state: { favorites: [movie(1)] }, version: 0 });
  });

  it("restores saved favorites when it rehydrates", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { favorites: [movie(7), movie(4)] }, version: 0 }),
    );

    await useFavoritesStore.persist.rehydrate();

    expect(favorites()).toEqual([movie(7), movie(4)]);
  });
});

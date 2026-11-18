import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import type { MovieSummary } from "@/types/tmdb";

const INCEPTION: MovieSummary = {
  id: 27205,
  title: "Inception",
  poster_path: null,
  release_date: "2010-07-16",
  vote_average: 8.4,
};

function favoriteIds() {
  return useFavoritesStore.getState().favorites.map(({ id }) => id);
}

beforeEach(() => {
  useFavoritesStore.setState({ favorites: [] });
  localStorage.clear();
});

// The labeled variant swaps its text with the CSS `invisible` class. jsdom has no CSS,
// so that visual swap is left to end-to-end tests in a real browser.
describe("FavoriteButton (icon variant)", () => {
  it("is a button named after the movie and starts not pressed", () => {
    render(<FavoriteButton movie={INCEPTION} variant="icon" />);

    expect(screen.getByRole("button", { name: "Favorite Inception" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("starts pressed when the movie is already a favorite", () => {
    useFavoritesStore.setState({ favorites: [INCEPTION] });

    render(<FavoriteButton movie={INCEPTION} variant="icon" />);

    expect(screen.getByRole("button", { name: "Favorite Inception" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("adds the movie to favorites when clicked", async () => {
    const user = userEvent.setup();
    render(<FavoriteButton movie={INCEPTION} variant="icon" />);
    const button = screen.getByRole("button", { name: "Favorite Inception" });

    await user.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(favoriteIds()).toEqual([INCEPTION.id]);
  });

  it("removes the movie from favorites when clicked again", async () => {
    const user = userEvent.setup();
    render(<FavoriteButton movie={INCEPTION} variant="icon" />);
    const button = screen.getByRole("button", { name: "Favorite Inception" });

    await user.click(button);
    await user.click(button);

    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(favoriteIds()).toEqual([]);
  });

  it("can be used with the keyboard", async () => {
    const user = userEvent.setup();
    render(<FavoriteButton movie={INCEPTION} variant="icon" />);
    const button = screen.getByRole("button", { name: "Favorite Inception" });

    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps every button for the same movie in sync", async () => {
    const user = userEvent.setup();
    render(
      <>
        <FavoriteButton movie={INCEPTION} variant="icon" />
        <FavoriteButton movie={INCEPTION} variant="icon" />
      </>,
    );
    const [first, second] = screen.getAllByRole("button", { name: "Favorite Inception" });

    await user.click(first);

    expect(second).toHaveAttribute("aria-pressed", "true");
  });
});

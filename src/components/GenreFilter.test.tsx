import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GenreFilter } from "@/components/GenreFilter";
import type { BrowseFilters } from "@/lib/browseFilters";
import type { Genre } from "@/types/tmdb";

const GENRES: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
];

const NO_FILTERS: BrowseFilters = {
  genreIds: [],
  sort: "popularity",
  fromYear: undefined,
  toYear: undefined,
  minRating: undefined,
};

function genreLink(name: string) {
  return screen.getByRole("link", { name });
}

// Reads the query string of a link, so the tests check meaning, not URL encoding.
function linkParams(name: string): URLSearchParams {
  const href = genreLink(name).getAttribute("href") ?? "";
  return new URL(href, "https://cineverse.test").searchParams;
}

describe("GenreFilter", () => {
  it("renders a navigation landmark named Genres", () => {
    render(<GenreFilter genres={GENRES} filters={NO_FILTERS} />);

    expect(screen.getByRole("navigation", { name: "Genres" })).toBeInTheDocument();
  });

  it("marks All as current when no genre is selected", () => {
    render(<GenreFilter genres={GENRES} filters={NO_FILTERS} />);

    expect(genreLink("All")).toHaveAttribute("aria-current", "true");
    expect(genreLink("Action")).not.toHaveAttribute("aria-current");
  });

  it("links an unselected genre to a list that adds it", () => {
    render(<GenreFilter genres={GENRES} filters={NO_FILTERS} />);

    expect(genreLink("Action")).toHaveAttribute("href", "/movies?genre=28");
  });

  it("adds a genre to the existing selection in sorted order", () => {
    render(<GenreFilter genres={GENRES} filters={{ ...NO_FILTERS, genreIds: [35] }} />);

    expect(linkParams("Adventure").get("genre")).toBe("12,35");
  });

  it("marks selected genres as current and links them to a list without them", () => {
    render(<GenreFilter genres={GENRES} filters={{ ...NO_FILTERS, genreIds: [12, 35] }} />);

    expect(genreLink("Comedy")).toHaveAttribute("aria-current", "true");
    expect(genreLink("All")).not.toHaveAttribute("aria-current");
    expect(linkParams("Comedy").get("genre")).toBe("12");
  });

  it("keeps the other filters when changing genres", () => {
    const filters: BrowseFilters = { ...NO_FILTERS, genreIds: [35], sort: "rating", minRating: 7 };
    render(<GenreFilter genres={GENRES} filters={filters} />);

    const actionParams = linkParams("Action");
    expect(actionParams.get("genre")).toBe("28,35");
    expect(actionParams.get("sort")).toBe("rating");
    expect(actionParams.get("rating")).toBe("7");

    const allParams = linkParams("All");
    expect(allParams.has("genre")).toBe(false);
    expect(allParams.get("sort")).toBe("rating");
  });
});

import { describe, expect, it } from "vitest";
import { selectKnownForMovies } from "@/lib/knownFor";
import type { PersonMovieCredit } from "@/types/tmdb";

function credit(
  id: number,
  voteCount: number,
  overrides: Partial<PersonMovieCredit> = {},
): PersonMovieCredit {
  return {
    id,
    title: `Movie ${id}`,
    overview: "",
    poster_path: null,
    backdrop_path: null,
    release_date: "2000-01-01",
    vote_average: 7,
    adult: false,
    vote_count: voteCount,
    character: "Lead",
    credit_id: `credit-${id}-${overrides.character ?? "Lead"}`,
    ...overrides,
  };
}

function ids(movies: PersonMovieCredit[]) {
  return movies.map(({ id }) => id);
}

describe("selectKnownForMovies", () => {
  it("puts the most-voted movies first", () => {
    const cast = [credit(1, 100), credit(2, 5_000), credit(3, 900)];

    expect(ids(selectKnownForMovies(cast, 12))).toEqual([2, 3, 1]);
  });

  it("keeps only the requested number of movies", () => {
    const cast = [credit(1, 100), credit(2, 300), credit(3, 200)];

    expect(ids(selectKnownForMovies(cast, 2))).toEqual([2, 3]);
  });

  it("lists a movie once when the person played two roles in it", () => {
    const cast = [credit(1, 500, { character: "Twin A" }), credit(1, 500, { character: "Twin B" })];

    expect(ids(selectKnownForMovies(cast, 12))).toEqual([1]);
  });

  it("leaves out adult titles", () => {
    const cast = [credit(1, 100), credit(2, 9_000, { adult: true })];

    expect(ids(selectKnownForMovies(cast, 12))).toEqual([1]);
  });

  it("returns nothing for a person without cast credits", () => {
    expect(selectKnownForMovies([], 12)).toEqual([]);
  });
});

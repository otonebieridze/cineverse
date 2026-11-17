import { describe, expect, it } from "vitest";
import { isValidMovieId } from "@/lib/movieId";

describe("isValidMovieId", () => {
  it.each(["550", "1", "1234567"])("accepts the numeric id %j", (id) => {
    expect(isValidMovieId(id)).toBe(true);
  });

  it.each(["", "abc", "12a", "a12", "-1", "1.5", " 550", "550 ", "../550"])(
    "rejects %j",
    (id) => {
      expect(isValidMovieId(id)).toBe(false);
    },
  );
});

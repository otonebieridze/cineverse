import { describe, expect, it } from "vitest";
import {
  type BrowseFilters,
  parseBrowseFilters,
  toBrowseHref,
  toBrowseParams,
} from "@/lib/browseFilters";

// A fixed year keeps the tests deterministic, whatever today's date is.
const CURRENT_YEAR = 2026;

const DEFAULT_FILTERS: BrowseFilters = {
  genreIds: [],
  sort: "popularity",
  fromYear: undefined,
  toYear: undefined,
  minRating: undefined,
};

describe("parseBrowseFilters", () => {
  it("returns the defaults when there are no search params", () => {
    expect(parseBrowseFilters({}, CURRENT_YEAR)).toEqual(DEFAULT_FILTERS);
  });

  describe("genres", () => {
    it("parses a comma-separated list into sorted, unique ids", () => {
      const { genreIds } = parseBrowseFilters({ genre: "28,12,28" }, CURRENT_YEAR);

      expect(genreIds).toEqual([12, 28]);
    });

    it("drops parts that are not whole numbers", () => {
      const { genreIds } = parseBrowseFilters({ genre: "35,abc,,-5,1.5" }, CURRENT_YEAR);

      expect(genreIds).toEqual([35]);
    });

    it("ignores a repeated genre param (array value)", () => {
      const { genreIds } = parseBrowseFilters({ genre: ["28", "12"] }, CURRENT_YEAR);

      expect(genreIds).toEqual([]);
    });
  });

  describe("sort", () => {
    it("keeps a known sort option", () => {
      expect(parseBrowseFilters({ sort: "rating" }, CURRENT_YEAR).sort).toBe("rating");
    });

    it("falls back to popularity for an unknown sort option", () => {
      expect(parseBrowseFilters({ sort: "random" }, CURRENT_YEAR).sort).toBe("popularity");
    });
  });

  describe("year range", () => {
    it("keeps a valid range as it is", () => {
      const filters = parseBrowseFilters({ from: "1990", to: "2010" }, CURRENT_YEAR);

      expect(filters).toMatchObject({ fromYear: 1990, toYear: 2010 });
    });

    it("allows only one end of the range", () => {
      const filters = parseBrowseFilters({ from: "2000" }, CURRENT_YEAR);

      expect(filters).toMatchObject({ fromYear: 2000, toYear: undefined });
    });

    it("clamps years to the range 1900 to the current year", () => {
      const filters = parseBrowseFilters({ from: "1800", to: "3000" }, CURRENT_YEAR);

      expect(filters).toMatchObject({ fromYear: 1900, toYear: CURRENT_YEAR });
    });

    it("swaps a reversed year range", () => {
      const filters = parseBrowseFilters({ from: "2010", to: "1990" }, CURRENT_YEAR);

      expect(filters).toMatchObject({ fromYear: 1990, toYear: 2010 });
    });

    it("ignores years that are not whole numbers", () => {
      const filters = parseBrowseFilters({ from: "abc", to: "1999.5" }, CURRENT_YEAR);

      expect(filters).toMatchObject({ fromYear: undefined, toYear: undefined });
    });
  });

  describe("minimum rating", () => {
    it("keeps a supported rating", () => {
      expect(parseBrowseFilters({ rating: "7" }, CURRENT_YEAR).minRating).toBe(7);
    });

    it.each(["4", "9", "7.5", "high"])("rejects the unsupported rating %j", (rating) => {
      expect(parseBrowseFilters({ rating }, CURRENT_YEAR).minRating).toBeUndefined();
    });
  });
});

describe("toBrowseParams", () => {
  it("returns no params for the default filters", () => {
    expect(toBrowseParams(DEFAULT_FILTERS)).toEqual({});
  });

  it("includes every non-default filter as a string", () => {
    const filters: BrowseFilters = {
      genreIds: [12, 28],
      sort: "rating",
      fromYear: 1990,
      toYear: 2010,
      minRating: 7,
    };

    expect(toBrowseParams(filters)).toEqual({
      genre: "12,28",
      sort: "rating",
      from: "1990",
      to: "2010",
      rating: "7",
    });
  });
});

describe("toBrowseHref", () => {
  it("links to the plain browse page for the default filters", () => {
    expect(toBrowseHref(DEFAULT_FILTERS)).toBe("/movies");
  });

  it("leaves the default sort out of the URL", () => {
    expect(toBrowseHref({ ...DEFAULT_FILTERS, genreIds: [35] })).toBe("/movies?genre=35");
  });
});

describe("round trip", () => {
  it("parses the params it builds back into the same filters", () => {
    const filters: BrowseFilters = {
      genreIds: [18, 80],
      sort: "release",
      fromYear: 1970,
      toYear: 1999,
      minRating: 8,
    };

    expect(parseBrowseFilters(toBrowseParams(filters), CURRENT_YEAR)).toEqual(filters);
  });
});

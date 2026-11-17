import { describe, expect, it, vi } from "vitest";
import { MAX_PAGE, loadPage, parsePage } from "@/lib/pagination";
import type { PaginatedResponse } from "@/types/tmdb";

describe("parsePage", () => {
  it("defaults to page 1 when there is no page param", () => {
    expect(parsePage(undefined)).toBe(1);
  });

  it("parses a valid page number", () => {
    expect(parsePage("3")).toBe(3);
  });

  it("clamps page 0 up to page 1", () => {
    expect(parsePage("0")).toBe(1);
  });

  it("clamps pages above the TMDB limit down to the last allowed page", () => {
    expect(parsePage("999")).toBe(MAX_PAGE);
  });

  it.each(["abc", "-2", "2.5", ""])("falls back to page 1 for %j", (value) => {
    expect(parsePage(value)).toBe(1);
  });

  it("falls back to page 1 for a repeated page param (array value)", () => {
    expect(parsePage(["2", "3"])).toBe(1);
  });
});

// A fake loader stands in for a TMDB request: it answers instantly, never touches
// the network, and lets each test decide how many pages "TMDB" reports.
function fakeLoader(totalPages: number) {
  return vi.fn(
    async (page: number): Promise<PaginatedResponse<string>> => ({
      page,
      results: [`movie on page ${page}`],
      total_pages: totalPages,
      total_results: totalPages * 20,
    }),
  );
}

describe("loadPage", () => {
  it("loads the requested page when it is in range", async () => {
    const load = fakeLoader(10);

    const result = await loadPage(load, 2);

    expect(result).toMatchObject({ page: 2, totalPages: 10 });
    expect(result.data.results).toEqual(["movie on page 2"]);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("falls back to the last page when the requested page is out of range", async () => {
    const load = fakeLoader(3);

    const result = await loadPage(load, 8);

    expect(result).toMatchObject({ page: 3, totalPages: 3 });
    expect(result.data.results).toEqual(["movie on page 3"]);
    expect(load).toHaveBeenNthCalledWith(1, 8);
    expect(load).toHaveBeenNthCalledWith(2, 3);
  });

  it("caps the total pages at the TMDB limit", async () => {
    const result = await loadPage(fakeLoader(1000), 1);

    expect(result.totalPages).toBe(MAX_PAGE);
  });

  it("does not load again when there are no results at all", async () => {
    const load = fakeLoader(0);

    const result = await loadPage(load, 5);

    expect(result.totalPages).toBe(0);
    expect(load).toHaveBeenCalledTimes(1);
  });
});

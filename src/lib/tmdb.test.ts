// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getPopularMovies, TMDB_TIMEOUT_MS } from "@/lib/tmdb";

// The TMDB client only runs inside Next.js on the server; outside it these are no-ops.
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

const POPULAR_MOVIES = { page: 1, results: [], total_pages: 1, total_results: 0 };

// A fake TMDB that never answers: like a real fetch, it only settles when its signal aborts.
function stubHangingFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
        }),
    ),
  );
}

// Node runs `AbortSignal.timeout` on an internal timer that fake timers can't advance, so the
// test swaps in the same behavior built on `setTimeout`, which they can.
function stubAbortSignalTimeout() {
  vi.spyOn(AbortSignal, "timeout").mockImplementation((milliseconds) => {
    const controller = new AbortController();
    setTimeout(
      () => controller.abort(new DOMException("The operation timed out.", "TimeoutError")),
      milliseconds,
    );
    return controller.signal;
  });
}

describe("TMDB client", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubAbortSignalTimeout();
    vi.stubEnv("TMDB_ACCESS_TOKEN", "test-token");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns the data when TMDB answers in time", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json(POPULAR_MOVIES)));

    await expect(getPopularMovies()).resolves.toEqual(POPULAR_MOVIES);
  });

  it("fails with a clear error when TMDB does not answer in time", async () => {
    stubHangingFetch();

    const request = getPopularMovies();
    const failure = expect(request).rejects.toThrow(
      `TMDB request timed out after ${TMDB_TIMEOUT_MS} ms: /movie/popular`,
    );
    await vi.advanceTimersByTimeAsync(TMDB_TIMEOUT_MS);

    await failure;
  });

  it("keeps waiting until the time limit is reached", async () => {
    stubHangingFetch();
    const settled = vi.fn();

    void getPopularMovies().then(settled, settled);
    await vi.advanceTimersByTimeAsync(TMDB_TIMEOUT_MS - 1);

    expect(settled).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(settled).toHaveBeenCalledOnce();
  });
});

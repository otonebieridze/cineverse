import { describe, expect, it } from "vitest";
import { pickTrailer } from "@/lib/videos";
import type { Video } from "@/types/tmdb";

function video(overrides: Partial<Video>): Video {
  return {
    id: "video",
    key: "abc123",
    name: "Official Trailer",
    site: "YouTube",
    type: "Trailer",
    official: true,
    published_at: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("pickTrailer", () => {
  it("returns undefined when there are no videos", () => {
    expect(pickTrailer([])).toBeUndefined();
  });

  it("ignores videos that are not YouTube trailers", () => {
    const videos = [
      video({ id: "teaser", type: "Teaser" }),
      video({ id: "featurette", type: "Featurette" }),
      video({ id: "vimeo", site: "Vimeo" }),
    ];

    expect(pickTrailer(videos)).toBeUndefined();
  });

  it("picks the YouTube trailer among other video types", () => {
    const videos = [
      video({ id: "teaser", type: "Teaser" }),
      video({ id: "trailer" }),
      video({ id: "clip", type: "Clip" }),
    ];

    expect(pickTrailer(videos)?.id).toBe("trailer");
  });

  it("prefers an official trailer over a newer unofficial one", () => {
    const videos = [
      video({ id: "fan-made", official: false, published_at: "2025-06-01T00:00:00.000Z" }),
      video({ id: "official", official: true, published_at: "2024-01-01T00:00:00.000Z" }),
    ];

    expect(pickTrailer(videos)?.id).toBe("official");
  });

  it("picks the newest trailer when several are equally official", () => {
    const videos = [
      video({ id: "older", published_at: "2023-03-01T00:00:00.000Z" }),
      video({ id: "newest", published_at: "2024-09-15T00:00:00.000Z" }),
      video({ id: "middle", published_at: "2024-01-10T00:00:00.000Z" }),
    ];

    expect(pickTrailer(videos)?.id).toBe("newest");
  });

  it("does not reorder the array it receives", () => {
    const videos = [
      video({ id: "older", published_at: "2023-03-01T00:00:00.000Z" }),
      video({ id: "newer", published_at: "2024-09-15T00:00:00.000Z" }),
    ];

    pickTrailer(videos);

    expect(videos.map(({ id }) => id)).toEqual(["older", "newer"]);
  });
});

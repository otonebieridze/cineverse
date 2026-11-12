import type { Video } from "@/types/tmdb";

export function pickTrailer(videos: Video[]): Video | undefined {
  return videos
    .filter((video) => video.site === "YouTube" && video.type === "Trailer")
    .toSorted(
      (a, b) =>
        Number(b.official) - Number(a.official) || b.published_at.localeCompare(a.published_at),
    )[0];
}

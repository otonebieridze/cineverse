import { MovieSection } from "@/components/MovieSection";
import { TrailerPlayer } from "@/components/TrailerPlayer";
import { getImageUrl } from "@/lib/images";
import { pickTrailer } from "@/lib/videos";
import type { VideoListResponse } from "@/types/tmdb";

type TrailerSectionProps = {
  videosPromise: Promise<VideoListResponse | null>;
  movieTitle: string;
  backdropPath: string | null;
};

export async function TrailerSection({
  videosPromise,
  movieTitle,
  backdropPath,
}: TrailerSectionProps) {
  const videos = await videosPromise;
  const trailer = pickTrailer(videos?.results ?? []);

  if (!trailer) {
    return null;
  }

  return (
    <MovieSection id="trailer" title="Trailer">
      <TrailerPlayer
        videoKey={trailer.key}
        title={`${movieTitle}: ${trailer.name}`}
        backdropUrl={getImageUrl(backdropPath, "w1280")}
      />
    </MovieSection>
  );
}

import { ExternalLink } from "@/components/ExternalLink";
import { MovieSection } from "@/components/MovieSection";
import { WatchProviders } from "@/components/WatchProviders";
import { toWatchProviderData } from "@/lib/watchProviders";
import type { WatchProvidersResponse } from "@/types/tmdb";

type WatchProvidersSectionProps = {
  providersPromise: Promise<WatchProvidersResponse | null>;
};

export async function WatchProvidersSection({ providersPromise }: WatchProvidersSectionProps) {
  const response = await providersPromise;
  // Trimmed here, so the browser receives only what the page shows, for every country.
  const data = response ? toWatchProviderData(response) : null;

  if (!data || Object.keys(data.regions).length === 0) {
    return null;
  }

  return (
    <MovieSection id="where-to-watch" title="Where to watch">
      <WatchProviders data={data} />
      {/* TMDB requires this credit for watch provider data. */}
      <p className="mt-6 text-sm text-muted">
        Streaming availability data by{" "}
        <ExternalLink
          href="https://www.justwatch.com/"
          className="rounded-sm text-foreground underline underline-offset-4 hover:decoration-2"
        >
          JustWatch
        </ExternalLink>
      </p>
    </MovieSection>
  );
}

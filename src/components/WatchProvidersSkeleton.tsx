// The real body has the same min-height: country picker (4rem), one group (6.25rem) and
// the TMDB link (2.75rem). Swapping the skeleton for one group or the empty state therefore
// doesn't move anything below it.
export const WATCH_PROVIDERS_BODY_CLASS_NAME = "min-h-52";

const PLACEHOLDER_PROVIDERS = 4;

type WatchProvidersSkeletonProps = {
  // As the Suspense fallback it stands in for the whole section, heading and credit included.
  fullSection?: boolean;
};

export function WatchProvidersSkeleton({ fullSection = false }: WatchProvidersSkeletonProps) {
  return (
    <div role="status">
      <span className="sr-only">Loading where to watch…</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        {fullSection && <div className="mb-6 h-8 w-48 rounded bg-surface" />}
        <div className={WATCH_PROVIDERS_BODY_CLASS_NAME}>
          <div className="h-5 w-16 rounded bg-surface" />
          <div className="mt-2 h-11 w-full rounded-full bg-surface sm:w-72" />
          <div className="mt-6 h-5 w-20 rounded bg-surface" />
          <ul className="mt-3 flex gap-6 overflow-hidden">
            {Array.from({ length: PLACEHOLDER_PROVIDERS }, (_, index) => (
              <li key={index} className="flex shrink-0 items-center gap-3">
                <div className="size-11 rounded-lg bg-surface" />
                <div className="h-4 w-20 rounded bg-surface" />
              </li>
            ))}
          </ul>
          <div className="mt-6 h-5 w-48 rounded bg-surface" />
        </div>
        {fullSection && <div className="mt-6 h-5 w-64 rounded bg-surface" />}
      </div>
    </div>
  );
}

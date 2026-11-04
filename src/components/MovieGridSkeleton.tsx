import { MovieGrid } from "@/components/MovieGrid";
import { MOVIES_PER_SECTION } from "@/components/MovieList";

export function MovieGridSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading movies…</span>
      <MovieGrid>
        {Array.from({ length: MOVIES_PER_SECTION }, (_, index) => (
          <li key={index} aria-hidden="true" className="motion-safe:animate-pulse">
            <div className="aspect-2/3 rounded-card bg-surface" />
            <div className="mt-3 h-4 w-3/4 rounded bg-surface" />
            <div className="mt-2 h-3 w-1/3 rounded bg-surface" />
          </li>
        ))}
      </MovieGrid>
    </div>
  );
}

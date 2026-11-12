import { CAST_LIMIT } from "@/components/CastList";

export function CastListSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading cast…</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="mb-6 h-8 w-40 rounded bg-surface" />
        <ul className="flex gap-4 overflow-hidden sm:gap-6">
          {Array.from({ length: CAST_LIMIT }, (_, index) => (
            <li key={index} className="w-28 shrink-0 sm:w-32">
              <div className="aspect-2/3 rounded-card bg-surface" />
              <div className="mt-3 h-4 w-3/4 rounded bg-surface" />
              <div className="mt-2 h-3 w-1/2 rounded bg-surface" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

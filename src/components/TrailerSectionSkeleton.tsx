export function TrailerSectionSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading trailer…</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="mb-6 h-8 w-32 rounded bg-surface" />
        <div className="aspect-video max-w-4xl rounded-card bg-surface" />
      </div>
    </div>
  );
}

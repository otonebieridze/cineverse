import { Container } from "@/components/Container";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";

export default function Loading() {
  return (
    <Container className="space-y-10 py-12 sm:py-16">
      <div aria-hidden="true" className="space-y-10 motion-safe:animate-pulse">
        <div className="h-9 w-64 rounded bg-surface sm:h-10" />
        <div className="space-y-4">
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-8 w-20 shrink-0 rounded-full bg-surface" />
            ))}
          </div>
          <div className="h-12 rounded-card bg-surface" />
        </div>
      </div>
      <MovieGridSkeleton />
    </Container>
  );
}

import { Container } from "@/components/Container";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";

export default function Loading() {
  return (
    <Container className="space-y-14 py-12 sm:py-16">
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="h-9 w-64 rounded bg-surface sm:h-10" />
        <div className="mt-4 h-5 w-80 max-w-full rounded bg-surface" />
      </div>
      <MovieGridSkeleton />
    </Container>
  );
}

import { Container } from "@/components/Container";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";

export default function Loading() {
  return (
    <Container className="space-y-10 py-12 sm:py-16">
      <div aria-hidden="true" className="space-y-10 motion-safe:animate-pulse">
        <div className="h-9 w-64 rounded bg-surface sm:h-10" />
        <div className="h-12 max-w-2xl rounded-full bg-surface" />
      </div>
      <MovieGridSkeleton />
    </Container>
  );
}

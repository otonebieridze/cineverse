import { Container } from "@/components/Container";
import { HeroBannerSkeleton } from "@/components/HeroBannerSkeleton";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";

export default function Loading() {
  return (
    <>
      <HeroBannerSkeleton />
      <Container className="space-y-14 py-12 sm:py-16">
        <div aria-hidden="true" className="h-8 w-56 rounded bg-surface motion-safe:animate-pulse" />
        <MovieGridSkeleton />
      </Container>
    </>
  );
}

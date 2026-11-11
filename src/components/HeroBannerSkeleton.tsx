import { Container } from "@/components/Container";

export function HeroBannerSkeleton() {
  return (
    <div role="status" className="flex min-h-112 items-end bg-surface sm:min-h-128 lg:min-h-160">
      <span className="sr-only">Loading featured movie…</span>
      <Container className="pt-24 pb-10 sm:pb-14 lg:pb-16">
        <div aria-hidden="true" className="max-w-2xl motion-safe:animate-pulse">
          <div className="h-4 w-40 rounded bg-surface-hover" />
          <div className="mt-4 h-10 w-3/4 rounded bg-surface-hover sm:h-12 lg:h-14" />
          <div className="mt-5 h-5 w-32 rounded bg-surface-hover" />
          <div className="mt-5 space-y-3">
            <div className="h-4 rounded bg-surface-hover" />
            <div className="h-4 w-5/6 rounded bg-surface-hover" />
          </div>
          <div className="mt-8 flex gap-3">
            <div className="h-12 w-36 rounded-full bg-surface-hover" />
            <div className="size-10 rounded-full bg-surface-hover" />
          </div>
        </div>
      </Container>
    </div>
  );
}

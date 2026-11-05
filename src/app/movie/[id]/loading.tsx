import { Container } from "@/components/Container";

export default function Loading() {
  return (
    <Container className="flex flex-col gap-8 py-12 sm:py-16 md:flex-row md:items-start md:gap-12">
      <div role="status" className="contents">
        <span className="sr-only">Loading movie…</span>
        <div
          aria-hidden="true"
          className="aspect-2/3 w-48 shrink-0 rounded-card bg-surface motion-safe:animate-pulse sm:w-56 md:w-72"
        />
        <div aria-hidden="true" className="w-full max-w-3xl motion-safe:animate-pulse">
          <div className="h-10 w-3/4 rounded bg-surface" />
          <div className="mt-4 h-5 w-1/2 rounded bg-surface" />
          <div className="mt-6 flex gap-2">
            <div className="h-7 w-20 rounded-full bg-surface" />
            <div className="h-7 w-24 rounded-full bg-surface" />
          </div>
          <div className="mt-8 space-y-3">
            <div className="h-4 rounded bg-surface" />
            <div className="h-4 rounded bg-surface" />
            <div className="h-4 w-5/6 rounded bg-surface" />
          </div>
        </div>
      </div>
    </Container>
  );
}

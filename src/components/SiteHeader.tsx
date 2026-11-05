import Link from "next/link";
import { Container } from "@/components/Container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="rounded-md text-xl font-bold tracking-tight transition-colors hover:text-accent"
        >
          Cine<span className="text-accent">Verse</span>
        </Link>
        <nav aria-label="Main">
          <Link
            href="/search"
            className="rounded-md font-medium text-muted transition-colors hover:text-foreground"
          >
            Search
          </Link>
        </nav>
      </Container>
    </header>
  );
}

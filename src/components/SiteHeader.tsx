import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { CurrentNavLinks } from "@/components/CurrentNavLinks";
import { NavLinks } from "@/components/NavLinks";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-md text-lg font-bold tracking-tight transition-colors hover:text-accent sm:text-xl"
        >
          Cine<span className="text-accent">Verse</span>
        </Link>
        <nav aria-label="Main">
          <Suspense fallback={<NavLinks currentPath={null} />}>
            <CurrentNavLinks />
          </Suspense>
        </nav>
      </Container>
    </header>
  );
}

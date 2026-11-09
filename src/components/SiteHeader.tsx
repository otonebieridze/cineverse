import Link from "next/link";
import { Container } from "@/components/Container";

const NAV_LINKS = [
  { href: "/movies", label: "Browse" },
  { href: "/search", label: "Search" },
  { href: "/favorites", label: "Favorites" },
];

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
          <ul className="flex gap-3 sm:gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-md text-sm font-medium text-muted transition-colors hover:text-foreground sm:text-base"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

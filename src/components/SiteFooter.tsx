import { Container } from "@/components/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-8 text-sm text-muted">
      <Container>
        <p>
          This product uses the{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm text-foreground underline underline-offset-4 hover:decoration-2"
          >
            TMDB
          </a>{" "}
          API but is not endorsed or certified by TMDB.
        </p>
      </Container>
    </footer>
  );
}

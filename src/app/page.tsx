import { Container } from "@/components/Container";

export default function Home() {
  return (
    <Container className="py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Discover movies
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Browse what&apos;s trending and popular right now.
      </p>
    </Container>
  );
}

import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-start gap-4 py-24">
      <h1 className="text-2xl font-bold tracking-tight">Movie not found</h1>
      <p className="text-muted">We couldn&apos;t find the movie you&apos;re looking for.</p>
      <Link
        href="/"
        className="rounded-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </Container>
  );
}

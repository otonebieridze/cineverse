"use client";

import { useEffect } from "react";
import { Container } from "@/components/Container";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-col items-start gap-4 py-24">
      <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="text-muted">We couldn&apos;t load movies right now. Please try again.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-full bg-accent px-5 py-2.5 font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </Container>
  );
}

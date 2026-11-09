import Link from "next/link";
import { Container } from "@/components/Container";

type NotFoundMessageProps = {
  title: string;
  message: string;
};

export function NotFoundMessage({ title, message }: NotFoundMessageProps) {
  return (
    <Container className="flex flex-col items-start gap-4 py-24">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted">{message}</p>
      <Link
        href="/"
        className="rounded-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </Container>
  );
}

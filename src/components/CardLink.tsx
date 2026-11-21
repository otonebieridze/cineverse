import Link from "next/link";
import type { ReactNode } from "react";

type CardLinkProps = {
  href: string;
  children: ReactNode;
};

export function CardLink({ href, children }: CardLinkProps) {
  return (
    <Link
      href={href}
      className="outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
    >
      {children}
    </Link>
  );
}

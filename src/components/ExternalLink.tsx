import type { ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

// Opens another site in a new tab, and tells screen reader users so before they follow it.
export function ExternalLink({ href, className, children }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children} <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

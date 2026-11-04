import type { ReactNode } from "react";

type MovieSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function MovieSection({ id, title, children }: MovieSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="mb-6 text-2xl font-bold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

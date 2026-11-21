import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { formatDate } from "@/lib/dates";
import { getImageUrl } from "@/lib/images";
import type { PersonDetails as PersonDetailsData } from "@/types/tmdb";

type Fact = {
  label: string;
  value: ReactNode;
};

type PersonDetailsProps = {
  person: PersonDetailsData;
};

function dateFact(label: string, isoDate: string | null): Fact | null {
  const formatted = isoDate ? formatDate(isoDate) : null;
  return isoDate && formatted
    ? { label, value: <time dateTime={isoDate}>{formatted}</time> }
    : null;
}

// Unknown facts are left out rather than shown as "Unknown".
function knownFacts(person: PersonDetailsData): Fact[] {
  return [
    dateFact("Born", person.birthday),
    person.place_of_birth ? { label: "Place of birth", value: person.place_of_birth } : null,
    dateFact("Died", person.deathday),
  ].filter((fact) => fact !== null);
}

export function PersonDetails({ person }: PersonDetailsProps) {
  const photoUrl = getImageUrl(person.profile_path, "w500");
  const facts = knownFacts(person);
  const paragraphs = person.biography
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article>
      <Container className="flex flex-col gap-8 py-12 sm:py-16 md:flex-row md:items-start md:gap-12">
        <div className="relative aspect-2/3 w-48 shrink-0 overflow-hidden rounded-card bg-surface shadow-card sm:w-56 md:w-72">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={`Photo of ${person.name}`}
              fill
              sizes="(min-width: 768px) 18rem, (min-width: 640px) 14rem, 12rem"
              className="object-cover"
              loading="eager"
              fetchPriority="high"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full items-center justify-center text-6xl font-semibold text-muted"
            >
              {person.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {person.name}
          </h1>

          {facts.length > 0 && (
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {facts.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd className="mt-1 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <h2 className="mt-8 text-xl font-semibold">Biography</h2>
          {paragraphs.length > 0 ? (
            <div className="mt-3 space-y-4 leading-relaxed text-foreground/90">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="mt-3 leading-relaxed text-foreground/90">No biography available.</p>
          )}
        </div>
      </Container>
    </article>
  );
}

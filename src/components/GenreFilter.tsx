import Link from "next/link";
import { type BrowseFilters, toBrowseHref } from "@/lib/browseFilters";
import type { Genre } from "@/types/tmdb";

type GenreFilterProps = {
  genres: Genre[];
  filters: BrowseFilters;
};

const PILL_CLASS_NAME =
  "block rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors";
const ACTIVE_PILL_CLASS_NAME = "border-accent bg-accent text-accent-foreground";
const INACTIVE_PILL_CLASS_NAME =
  "border-border bg-surface text-muted hover:bg-surface-hover hover:text-foreground";

export function GenreFilter({ genres, filters }: GenreFilterProps) {
  const isAllActive = filters.genreIds.length === 0;

  function toggledGenreIds(id: number): number[] {
    return filters.genreIds.includes(id)
      ? filters.genreIds.filter((genreId) => genreId !== id)
      : [...filters.genreIds, id].toSorted((a, b) => a - b);
  }

  return (
    <nav aria-label="Genres">
      <p id="genre-filter-hint" className="sr-only">
        Select one or more genres. Movies must match all selected genres.
      </p>
      <ul
        aria-describedby="genre-filter-hint"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        <li className="shrink-0">
          <Link
            href={toBrowseHref({ ...filters, genreIds: [] })}
            aria-current={isAllActive ? "true" : undefined}
            className={`${PILL_CLASS_NAME} ${isAllActive ? ACTIVE_PILL_CLASS_NAME : INACTIVE_PILL_CLASS_NAME}`}
          >
            All
          </Link>
        </li>
        {genres.map(({ id, name }) => {
          const isActive = filters.genreIds.includes(id);

          return (
            <li key={id} className="shrink-0">
              <Link
                href={toBrowseHref({ ...filters, genreIds: toggledGenreIds(id) })}
                aria-current={isActive ? "true" : undefined}
                className={`${PILL_CLASS_NAME} ${isActive ? ACTIVE_PILL_CLASS_NAME : INACTIVE_PILL_CLASS_NAME}`}
              >
                {isActive && <span aria-hidden="true">✓ </span>}
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

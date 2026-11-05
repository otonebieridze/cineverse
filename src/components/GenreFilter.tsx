import Link from "next/link";
import type { Genre } from "@/types/tmdb";

type GenreFilterProps = {
  genres: Genre[];
  activeGenreId: number | undefined;
};

export function GenreFilter({ genres, activeGenreId }: GenreFilterProps) {
  const options = [{ id: undefined, name: "All" }, ...genres];

  return (
    <nav aria-label="Genres">
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {options.map(({ id, name }) => {
          const isActive = id === activeGenreId;

          return (
            <li key={id ?? "all"} className="shrink-0">
              <Link
                href={id === undefined ? "/movies" : `/movies?genre=${id}`}
                aria-current={isActive ? "page" : undefined}
                className={`block rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-surface text-muted hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

import Form from "next/form";
import Link from "next/link";
import { Button } from "@/components/Button";
import {
  type BrowseFilters,
  DEFAULT_SORT,
  MIN_RATING_OPTIONS,
  MIN_YEAR,
  SORT_OPTIONS,
  toBrowseHref,
} from "@/lib/browseFilters";

type BrowseFiltersFormProps = {
  filters: BrowseFilters;
  currentYear: number;
};

const LABEL_CLASS_NAME = "text-sm font-medium text-muted";
const FIELD_CLASS_NAME =
  "mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm";

export function BrowseFiltersForm({ filters, currentYear }: BrowseFiltersFormProps) {
  const activeCount = [
    filters.sort !== DEFAULT_SORT,
    filters.fromYear !== undefined || filters.toYear !== undefined,
    filters.minRating !== undefined,
  ].filter(Boolean).length;
  const resetHref = toBrowseHref({
    genreIds: filters.genreIds,
    sort: DEFAULT_SORT,
    fromYear: undefined,
    toYear: undefined,
    minRating: undefined,
  });

  return (
    <details
      open={activeCount > 0}
      className="group rounded-card border border-border bg-surface"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-card px-5 py-3 font-medium [&::-webkit-details-marker]:hidden">
        <span>
          Filters
          {activeCount > 0 && (
            <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
              {activeCount}
              <span className="sr-only"> active</span>
            </span>
          )}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="size-5 text-muted transition-transform group-open:rotate-180"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      <Form
        key={toBrowseHref(filters)}
        action="/movies"
        className="border-t border-border px-5 pt-4 pb-5"
      >
        {filters.genreIds.length > 0 && (
          <input type="hidden" name="genre" value={filters.genreIds.join(",")} />
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <label className="col-span-2 sm:col-span-1">
            <span className={LABEL_CLASS_NAME}>Sort by</span>
            <select name="sort" defaultValue={filters.sort} className={FIELD_CLASS_NAME}>
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className={LABEL_CLASS_NAME}>From year</span>
            <input
              type="number"
              name="from"
              inputMode="numeric"
              min={MIN_YEAR}
              max={currentYear}
              placeholder={String(MIN_YEAR)}
              defaultValue={filters.fromYear}
              className={FIELD_CLASS_NAME}
            />
          </label>

          <label>
            <span className={LABEL_CLASS_NAME}>To year</span>
            <input
              type="number"
              name="to"
              inputMode="numeric"
              min={MIN_YEAR}
              max={currentYear}
              placeholder={String(currentYear)}
              defaultValue={filters.toYear}
              className={FIELD_CLASS_NAME}
            />
          </label>

          <label className="col-span-2 sm:col-span-1">
            <span className={LABEL_CLASS_NAME}>Minimum rating</span>
            <select
              name="rating"
              defaultValue={filters.minRating ?? ""}
              className={FIELD_CLASS_NAME}
            >
              <option value="">Any rating</option>
              {MIN_RATING_OPTIONS.map((rating) => (
                <option key={rating} value={rating}>
                  {rating}+
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <Button type="submit" className="px-6 py-2.5">
            Apply
          </Button>
          {activeCount > 0 && (
            <Link
              href={resetHref}
              className="rounded-sm text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              Reset filters
            </Link>
          )}
        </div>
      </Form>
    </details>
  );
}

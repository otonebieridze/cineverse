import Link from "next/link";

type PaginationProps = {
  pathname: string;
  params?: Record<string, string>;
  page: number;
  totalPages: number;
};

const BUTTON_CLASS_NAME =
  "rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium";

export function Pagination({ pathname, params = {}, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  function hrefFor(target: number) {
    const searchParams = new URLSearchParams(params);
    if (target > 1) {
      searchParams.set("page", String(target));
    }
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function pageLink(target: number, label: string, enabled: boolean) {
    if (!enabled) {
      return (
        <span aria-disabled="true" className={`${BUTTON_CLASS_NAME} text-muted opacity-50`}>
          {label}
        </span>
      );
    }

    return (
      <Link
        href={hrefFor(target)}
        className={`${BUTTON_CLASS_NAME} transition-colors hover:bg-surface-hover`}
      >
        {label}
      </Link>
    );
  }

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-2 sm:gap-4">
      {pageLink(page - 1, "Previous", page > 1)}
      <p className="text-sm whitespace-nowrap text-muted">
        Page {page} of {totalPages}
      </p>
      {pageLink(page + 1, "Next", page < totalPages)}
    </nav>
  );
}

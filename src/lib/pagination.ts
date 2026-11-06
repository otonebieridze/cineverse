import type { PaginatedResponse } from "@/types/tmdb";

// TMDB rejects page numbers above 500.
export const MAX_PAGE = 500;

export function parsePage(value: string | string[] | undefined): number {
  const page = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : 1;
  return Math.min(Math.max(page, 1), MAX_PAGE);
}

// Loads the requested page, falling back to the last page when it is out of range.
export async function loadPage<T>(
  load: (page: number) => Promise<PaginatedResponse<T>>,
  page: number,
): Promise<{ data: PaginatedResponse<T>; page: number; totalPages: number }> {
  const data = await load(page);
  const totalPages = Math.min(data.total_pages, MAX_PAGE);

  if (page <= totalPages || totalPages === 0) {
    return { data, page, totalPages };
  }

  return { data: await load(totalPages), page: totalPages, totalPages };
}

import type { ReactNode } from "react";

export const GRID_MIN_COLUMNS = 2;
export const GRID_MAX_COLUMNS = 6;

type MovieGridProps = {
  children: ReactNode;
};

export function MovieGrid({ children }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-6">
      {children}
    </ul>
  );
}

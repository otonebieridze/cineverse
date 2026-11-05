export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

export type Genre = {
  id: number;
  name: string;
};

export type MovieDetails = Movie & {
  runtime: number | null;
  tagline: string | null;
  genres: Genre[];
};

export type PaginatedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

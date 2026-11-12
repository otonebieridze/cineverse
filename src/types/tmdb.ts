export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

export type MovieSummary = Pick<
  Movie,
  "id" | "title" | "poster_path" | "release_date" | "vote_average"
>;

export type Genre = {
  id: number;
  name: string;
};

export type GenreListResponse = {
  genres: Genre[];
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

export type CastMember = {
  id: number;
  credit_id: string;
  name: string;
  character: string;
  profile_path: string | null;
};

export type MovieCredits = {
  cast: CastMember[];
};

export type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
};

export type VideoListResponse = {
  results: Video[];
};

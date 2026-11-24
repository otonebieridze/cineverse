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

export type PersonDetails = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
};

export type PersonMovieCredit = Movie & {
  adult: boolean;
  vote_count: number;
  character: string;
  credit_id: string;
};

export type PersonMovieCredits = {
  cast: PersonMovieCredit[];
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

export type WatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority: number;
};

// TMDB leaves out a list when a country has no providers of that kind.
export type WatchProviderCountry = {
  link: string;
  flatrate?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
};

export type WatchProvidersResponse = {
  id: number;
  // Keyed by ISO 3166-1 country code, e.g. "US".
  results: Record<string, WatchProviderCountry>;
};

import "server-only";
import { cacheLife } from "next/cache";
import type { BrowseFilters, SortOption } from "@/lib/browseFilters";
import type {
  GenreListResponse,
  Movie,
  MovieCredits,
  MovieDetails,
  PaginatedResponse,
  VideoListResponse,
} from "@/types/tmdb";

const API_BASE_URL = "https://api.themoviedb.org/3";

const DISCOVER_SORT_BY: Record<SortOption, string> = {
  popularity: "popularity.desc",
  rating: "vote_average.desc",
  release: "primary_release_date.desc",
};

const MIN_VOTE_COUNT = 200;

function isValidMovieId(id: string): boolean {
  return /^\d+$/.test(id);
}

async function tmdbFetch<T>(path: string): Promise<T> {
  const data = await tmdbFetchOrNull<T>(path);
  if (data === null) {
    throw new Error(`TMDB resource not found: ${path}`);
  }
  return data;
}

async function tmdbFetchOrNull<T>(path: string): Promise<T | null> {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN is not set. See .env.example.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status} ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function getPopularMovies(): Promise<PaginatedResponse<Movie>> {
  "use cache";
  cacheLife("hours");
  return tmdbFetch("/movie/popular");
}

export async function getTrendingMovies(): Promise<PaginatedResponse<Movie>> {
  "use cache";
  cacheLife("hours");
  return tmdbFetch("/trending/movie/week");
}

export async function getMovieGenres(): Promise<GenreListResponse> {
  "use cache";
  cacheLife("weeks");
  return tmdbFetch("/genre/movie/list");
}

export async function discoverMovies(
  filters: BrowseFilters,
  page: number,
): Promise<PaginatedResponse<Movie>> {
  "use cache";
  cacheLife("hours");
  const params = new URLSearchParams({
    sort_by: DISCOVER_SORT_BY[filters.sort],
    include_adult: "false",
    page: String(page),
  });
  if (filters.genreId !== undefined) {
    params.set("with_genres", String(filters.genreId));
  }
  if (filters.fromYear !== undefined) {
    params.set("primary_release_date.gte", `${filters.fromYear}-01-01`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const releasedBefore = filters.toYear !== undefined ? `${filters.toYear}-12-31` : undefined;
  if (filters.sort === "release") {
    params.set(
      "primary_release_date.lte",
      releasedBefore && releasedBefore < today ? releasedBefore : today,
    );
  } else if (releasedBefore) {
    params.set("primary_release_date.lte", releasedBefore);
  }

  if (filters.minRating !== undefined) {
    params.set("vote_average.gte", String(filters.minRating));
  }
  if (filters.sort === "rating" || filters.minRating !== undefined) {
    params.set("vote_count.gte", String(MIN_VOTE_COUNT));
  }
  return tmdbFetch(`/discover/movie?${params}`);
}

export async function searchMovies(
  query: string,
  page: number,
): Promise<PaginatedResponse<Movie>> {
  "use cache";
  cacheLife("hours");
  const params = new URLSearchParams({ query, include_adult: "false", page: String(page) });
  return tmdbFetch(`/search/movie?${params}`);
}

export async function getMovieDetails(id: string): Promise<MovieDetails | null> {
  "use cache";
  cacheLife("days");
  if (!isValidMovieId(id)) {
    return null;
  }
  return tmdbFetchOrNull(`/movie/${id}`);
}

export async function getMovieCredits(id: string): Promise<MovieCredits | null> {
  "use cache";
  cacheLife("days");
  if (!isValidMovieId(id)) {
    return null;
  }
  return tmdbFetchOrNull(`/movie/${id}/credits`);
}

export async function getMovieVideos(id: string): Promise<VideoListResponse | null> {
  "use cache";
  cacheLife("days");
  if (!isValidMovieId(id)) {
    return null;
  }
  return tmdbFetchOrNull(`/movie/${id}/videos`);
}

export async function getMovieRecommendations(
  id: string,
): Promise<PaginatedResponse<Movie> | null> {
  "use cache";
  cacheLife("hours");
  if (!isValidMovieId(id)) {
    return null;
  }
  return tmdbFetchOrNull(`/movie/${id}/recommendations`);
}

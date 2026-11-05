import "server-only";
import { cacheLife } from "next/cache";
import type { Movie, MovieDetails, PaginatedResponse } from "@/types/tmdb";

const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export type ImageSize = "w185" | "w342" | "w500" | "w780" | "w1280" | "original";

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

export async function getMovieDetails(id: string): Promise<MovieDetails | null> {
  "use cache";
  cacheLife("days");
  if (!/^\d+$/.test(id)) {
    return null;
  }
  return tmdbFetchOrNull(`/movie/${id}`);
}

export function getImageUrl(path: string | null, size: ImageSize): string | null {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

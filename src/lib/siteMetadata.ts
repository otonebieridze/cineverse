import type { Metadata } from "next";

export const SITE_NAME = "CineVerse";

export const SITE_URL = "https://cineverse-three-eta.vercel.app";

export const SITE_DESCRIPTION = "Discover popular and trending movies, powered by TMDB.";

// Next.js merges metadata shallowly: a page that sets `openGraph` replaces the layout's
// whole object. Pages spread these shared fields in so they are not lost.
export const SHARED_OPEN_GRAPH = {
  siteName: SITE_NAME,
  locale: "en_US",
  type: "website",
} satisfies NonNullable<Metadata["openGraph"]>;

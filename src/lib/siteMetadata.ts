import type { Metadata } from "next";

export const SITE_NAME = "CineVerse";

export const SITE_URL = "https://cineverse-three-eta.vercel.app";

export const SITE_TITLE = "CineVerse: Discover, Search and Save Your Favorite Movies";

export const SITE_DESCRIPTION =
  "Discover popular and trending movies, search by title, filter by genre, year and rating, watch trailers, see the cast and save favorites.";

// Next.js merges metadata shallowly: a page that sets `openGraph` replaces the layout's
// whole object. Pages spread these shared fields in so they are not lost.
export const SHARED_OPEN_GRAPH = {
  siteName: SITE_NAME,
  locale: "en_US",
  type: "website",
} satisfies NonNullable<Metadata["openGraph"]>;

// The default share image from `src/app/opengraph-image.png`. Next.js only adds that file
// to pages that don't set their own `openGraph`, so pages that do must list it themselves.
// Keep in sync with the file and `opengraph-image.alt.txt` (checked in e2e/metadata.spec.ts).
export const DEFAULT_OPEN_GRAPH_IMAGE = {
  url: "/opengraph-image.png",
  type: "image/png",
  width: 1200,
  height: 630,
  alt: "CineVerse: discover trending movies and save your favorites",
};

// Metadata for a top-level page, so link previews show the page's own title. The page's
// `openGraph` replaces the layout's, so it carries the shared fields, description and image.
export function pageMetadata(title: string): Metadata {
  return {
    title,
    openGraph: {
      ...SHARED_OPEN_GRAPH,
      title: `${title} | ${SITE_NAME}`,
      description: SITE_DESCRIPTION,
      images: [DEFAULT_OPEN_GRAPH_IMAGE],
    },
  };
}

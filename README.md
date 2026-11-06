# CineVerse

A movie discovery app built with Next.js and the [TMDB API](https://www.themoviedb.org/documentation/api). Browse popular and trending movies, search, filter by genre, view details, and save favorites.

> **Status:** in development. Live demo and screenshots will be added soon.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) and React
- TypeScript
- Tailwind CSS
- Zustand (client state)
- TMDB API (data source)

## Features

- [x] Popular and trending movies
- [x] Movie details page
- [x] Search with debounced input
- [x] Genre filtering and pagination
- [ ] Favorites (persisted in localStorage)
- [ ] Responsive layout
- [ ] Deployment on Vercel

## Getting Started

### Prerequisites

- Node.js 20 or newer
- A free [TMDB account](https://www.themoviedb.org/signup) and an **API Read Access Token** (Settings → API)

### Installation

```bash
git clone https://github.com/otonebieridze/cineverse.git
cd cineverse
npm install
```

### Environment variables

Copy the example file and add your token:

```bash
cp .env.example .env.local
```

| Variable           | Description                          |
| ------------------ | ------------------------------------ |
| `TMDB_ACCESS_TOKEN` | TMDB API Read Access Token (server-only) |

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the development server     |
| `npm run build` | Create a production build        |
| `npm run start` | Run the production build         |
| `npm run lint`  | Run ESLint                       |

## Architecture Notes

- **Server-side data fetching.** All TMDB requests run on the server, so the access token is never exposed to the browser (no `NEXT_PUBLIC_` prefix).
- **Caching.** TMDB responses are cached with Next.js `fetch` revalidation to keep navigation fast and reduce API calls.
- **Server Components by default.** `"use client"` is used only for interactive parts such as search, filters, and favorites.

## Acknowledgements

This product uses the TMDB API but is not endorsed or certified by [TMDB](https://www.themoviedb.org/).

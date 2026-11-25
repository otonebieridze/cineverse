# CineVerse

[![CI](https://github.com/otonebieridze/cineverse/actions/workflows/ci.yml/badge.svg)](https://github.com/otonebieridze/cineverse/actions/workflows/ci.yml)

A movie discovery app built with Next.js and the [TMDB API](https://www.themoviedb.org/documentation/api). Browse trending movies, search and filter, see where to watch, explore actors, and save favorites.

**Live demo:** [cineverse-three-eta.vercel.app](https://cineverse-three-eta.vercel.app/)

## Highlights

- **Server-first.** All TMDB requests run on the server with per-endpoint caching, so the API token never reaches the browser.
- **Accessible.** Lighthouse accessibility score of 100 on every main page, and automated axe checks in CI.
- **Tested.** Unit, component and end-to-end tests run in GitHub Actions on every pull request.
- **Fast.** Lighthouse performance between 97 and 99 on every main page (mobile, live site, median of 3 runs, November 2026).

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) and React
- TypeScript
- Tailwind CSS
- Zustand (client state)
- TMDB API (data source)
- [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) (unit and component tests)
- [Playwright](https://playwright.dev/) and [axe-core](https://github.com/dequelabs/axe-core) (end-to-end and accessibility tests)
- [GitHub Actions](https://github.com/features/actions) (CI) and [Vercel](https://vercel.com/) (hosting)

## Features

**Discover**

- Popular and trending movies, with a featured hero on the home page
- Search with debounced input
- Browse with multi-genre filters, sort, year range, minimum rating and pagination, all kept in shareable URLs

**Details**

- Movie details with a click-to-load trailer, cast and recommendations
- Where to watch: stream, free, rent and buy options per country, with the chosen country remembered in the browser
- Cast row with scroll snapping, arrow buttons, and keyboard and swipe support
- Actor pages with photo, biography and known-for movies, linked from the cast row

**Personal**

- Favorites saved in the browser (localStorage)

**Quality**

- Accessibility: skip link, current page marked in the navigation (`aria-current`, not color alone), keyboard-accessible cast row, and automated axe checks in CI
- SEO: descriptive titles, meta descriptions and per-page Open Graph tags
- Responsive layout

## Getting Started

### Prerequisites

- Node.js 24 (see `.nvmrc`; CI uses the same version)
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

| Variable            | Description                              |
| ------------------- | ---------------------------------------- |
| `TMDB_ACCESS_TOKEN` | TMDB API Read Access Token (server-only) |

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start the development server |
| `npm run build`      | Create a production build    |
| `npm run start`      | Run the production build     |
| `npm run lint`       | Run ESLint                   |
| `npm test`           | Run unit tests once          |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e`   | Run end-to-end tests         |

## Testing

Unit and component tests use [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), and sit next to the code they test (`*.test.ts(x)`). They cover pure logic and interactive components, and never call the TMDB API, so they are fast and deterministic.

```bash
npm test                                  # run all unit tests once
npm run test:watch                        # re-run tests on every file save
npx vitest run src/lib/videos.test.ts     # run a single test file
npx vitest run -t "prefers an official"   # run tests whose name matches
```

End-to-end tests use [Playwright](https://playwright.dev/) and live in `e2e/`. They drive a real browser against the production build and the real TMDB API, so they need `TMDB_ACCESS_TOKEN` in `.env.local`. An accessibility suite (`e2e/accessibility.spec.ts`) scans the main pages with [axe](https://github.com/dequelabs/axe-core) and fails on any WCAG A/AA or best-practice violation.

```bash
npx playwright install chromium   # one-time browser download
npm run build                     # e2e tests run against the production build
npm run test:e2e                  # run all end-to-end tests
npx playwright test --ui          # step through tests in the interactive UI
npx playwright show-report        # open the HTML report of the last run
```

On every pull request and push to `main`, GitHub Actions runs lint, the unit tests, the production build and the end-to-end tests (including the axe checks) in Chromium, and keeps the Playwright report when a run fails.

## Deployment

The app is deployed on [Vercel](https://vercel.com/):

1. Import the GitHub repository in Vercel. The Next.js preset needs no extra configuration.
2. Under **Settings → Environment Variables**, add `TMDB_ACCESS_TOKEN` for **Production** and **Preview** before the first build. Pages are prerendered at build time and call TMDB, so the build fails without it.
3. Deploy. Every push to `main` triggers a production deployment, and pull requests get preview deployments.

## Architecture Notes

- **Server-side data fetching.** All TMDB requests run on the server, so the access token is never exposed to the browser (no `NEXT_PUBLIC_` prefix).
- **Caching.** TMDB requests are cached with the `"use cache"` directive and a `cacheLife` profile chosen per endpoint to keep navigation fast and reduce API calls: hours for movie lists, search, recommendations and watch providers; days for movie details, credits and videos and for actor details and credits; weeks for the genre list.
- **Server Components by default.** `"use client"` is used only where the browser is needed: the search input, favorites, the cast row's scroll controls, the trailer player, the Where to watch country picker, the navigation's current-page marker and the error page. The browse filters are server-rendered links and a `next/form` form.
- **Where to watch without losing caching.** Streaming data for all countries is fetched once per movie and cached. The visitor's country is chosen in the browser (their saved choice, or else their browser language), so nothing on the server reads cookies or headers and the page stays fully cacheable.
- **SEO note.** On movie and actor pages, Next.js streams the meta description into `<body>`, so Lighthouse scores SEO 91 there instead of 100. According to the Next.js docs, Googlebot reads it; link-preview crawlers such as Facebook's receive it in `<head>`.
- **Request timeouts.** TMDB requests time out after 8 seconds. If a page's main request fails, a "Try again" screen is shown; optional sections on the movie page, such as cast, trailers and Where to watch, are left out instead.
- **Click-to-load trailers.** The details page shows a lightweight preview with a play button. The privacy-enhanced YouTube embed (`youtube-nocookie.com`) loads only after the user presses play.

## Acknowledgements

This product uses the TMDB API but is not endorsed or certified by [TMDB](https://www.themoviedb.org/).

Streaming availability data by [JustWatch](https://www.justwatch.com/).

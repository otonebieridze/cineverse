@AGENTS.md

# CineVerse

A fast, polished movie discovery app built with Next.js (App Router), TypeScript and Tailwind CSS, powered by the TMDB API. The goal is a production-quality codebase: fast, consistent, accessible, and visually refined.

See `README.md` for setup and the feature checklist.

## Commands

- `npm run dev` - start the dev server
- `npm run lint` - run ESLint
- `npm run build` - production build (also type-checks the whole project)
- `npm test` - run unit tests once (Vitest)
- `npm run test:watch` - run unit tests in watch mode
- `npm run test:e2e` - run end-to-end tests (Playwright) against the production build; run `npm run build` first

Run `npm run lint && npm test && npm run build` before considering any code change done. GitHub Actions (`.github/workflows/ci.yml`) runs the same checks, plus the end-to-end tests, on every pull request and push to `main`.

## Architecture

- **Server Components by default.** Add `"use client"` only for real interactivity (search input, filters, favorites) and push it as far down the component tree as possible.
- **TMDB access is server-only.** All requests go through `src/lib/tmdb.ts`. The token (`TMDB_ACCESS_TOKEN`) is read from the environment, sent in the `Authorization` header, and never exposed to the browser (no `NEXT_PUBLIC_` prefix).
- **Typed end to end.** TypeScript strict mode, no `any`. Every TMDB response has a type in `src/types`.
- **Client state** (e.g. favorites) lives in small, focused Zustand stores. Do not use client state for data that can be fetched on the server.

## Performance

Speed is a core requirement, not a later optimization.

- Cache TMDB requests with `"use cache"` + `cacheLife` (Cache Components is enabled), and choose the profile per endpoint.
- Fetch independent data in parallel with `Promise.all`. Avoid request waterfalls.
- Give every data-driven route a `loading.tsx` and use `<Suspense>` so the UI appears immediately and data streams in.
- Navigate with `next/link` only (never plain `<a>` or `router.push` for internal links) so prefetching works.
- Use `next/image` with accurate `sizes`. Use `fetchPriority="high"` (or `preload`) only on the above-the-fold image that is the LCP candidate; `priority` is deprecated in Next.js 16.
- Use `next/font` for fonts. No layout shift.
- Keep client bundles small: avoid heavy dependencies, and lazy-load large client-only code with `next/dynamic`.
- Do not add a dependency without a clear reason.

## Code Style

- Components: `PascalCase` files and exports. Hooks: `useCamelCase`. Utilities: `camelCase`.
- Use the `@/` import alias. No deep relative imports.
- One component per file. Keep components small and single-purpose.
- Prefer named exports. Default exports only where Next.js requires them (pages, layouts).
- Handle loading, empty, and error states explicitly (`loading.tsx`, `error.tsx`, `not-found.tsx`).

## Styling and Design

- Tailwind CSS utilities only. No inline `style` props and no ad-hoc CSS files, except global styles in `src/app/globals.css`.
- Define design tokens once (colors, fonts, radii, shadows, spacing scale) in the global theme and reuse them. Do not hardcode hex values or arbitrary values (`w-[137px]`) when a token or standard utility exists.
- Keep class lists consistent and readable. Extract repeated patterns into components, not copy-pasted class strings.
- Mobile-first and fully responsive.
- Aim for a refined, cinematic, consistent look: clear visual hierarchy, generous spacing, smooth but restrained motion, and polished hover/focus states.
- Accessibility is required: semantic HTML, meaningful `alt` text, visible focus styles, keyboard navigation, sufficient color contrast.

## Testing

- Unit tests use Vitest and live next to the code they test as `*.test.ts(x)`.
- Component tests use React Testing Library. Query by role and accessible name (`getByRole`), not by CSS classes or test ids, and interact with `user-event`.
- Unit and component tests never hit the network (no real TMDB calls). Replace slow or unpredictable dependencies with fakes at the boundary.
- End-to-end tests live in `e2e/` and are the only tests that use the real TMDB API. Assert on structure, not on titles that change over time. Use web-first assertions (`await expect(locator)...`) and never fixed waits, and only interact after the page is hydrated.
- Test behavior through the public API, not implementation details. No snapshot tests, no chasing a coverage number.

## Project Structure

```
src/
  app/          routes, layouts, loading/error boundaries
  components/   reusable UI components
  lib/          TMDB client, utilities
  stores/       Zustand stores (client state)
  types/        shared TypeScript types
```

## Workflow Rules

- Make only the changes that were requested. No unrelated refactors or extra features.
- Do not read or modify `.env*` files. Environment variables are documented in `.env.example`.
- Do not commit or push unless explicitly asked.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `ci:`, `docs:`, `chore:`), in the imperative mood, one logical change per commit.
- If a requirement is ambiguous or a change would affect the architecture above, ask before proceeding.

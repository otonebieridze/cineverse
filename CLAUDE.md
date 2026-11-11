@AGENTS.md

# CineVerse

A fast, polished movie discovery app built with Next.js (App Router), TypeScript and Tailwind CSS, powered by the TMDB API. The goal is a production-quality codebase: fast, consistent, accessible, and visually refined.

See `README.md` for setup and the feature checklist.

## Commands

- `npm run dev` - start the dev server
- `npm run lint` - run ESLint
- `npm run build` - production build (also type-checks the whole project)

Run `npm run lint && npm run build` before considering any code change done.

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
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`), in the imperative mood, one logical change per commit.
- If a requirement is ambiguous or a change would affect the architecture above, ask before proceeding.

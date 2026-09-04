# CLAUDE.md

## Project
CineVerse — a production-quality movie discovery web app (portfolio project). Planned features: discovery, search, movie details, popular/trending/upcoming, favorites & watchlists, ratings, filtering/sorting, recommendations, and (later) AI recommendations. Build only what's currently asked — no speculative features.

## Stack
Next.js, TypeScript, Tailwind CSS. Add other libraries only when genuinely necessary; avoid dependency bloat and over-engineering.

## Architecture & Code Quality
- Use Server and Client Components intentionally — don't default everything to client-side.
- Separate UI, data fetching, and application logic. Keep external API logic in its own layer, isolated from UI components.
- Use state management appropriate to the need; avoid unnecessary global state and premature abstractions.
- Write clean, strongly-typed, maintainable TypeScript. Avoid giant components, duplicated logic, and unnecessary custom hooks.
- Include proper loading, error, and empty states. Write meaningful tests. Never hardcode secrets — use environment variables.

## UI
Modern, minimalist, cinematic, professional, responsive, and consistent. Prioritize usability, accessibility, and visual hierarchy.

## Workflow
- Before changing code: inspect the relevant files and follow existing conventions.
- Make focused changes only — don't touch unrelated code.
- After meaningful changes, run type-checking, linting, tests, or build as appropriate. Don't claim something works without verifying it.

# Pitchside — EPL Tracking Dashboard (Phase 1)

A Premier League analytics dashboard built with React, TypeScript, Vite, and
Tailwind CSS. Currently running on deterministic mock season data through a
provider abstraction that lets a real EPL data API be swapped in later
without touching any page or component.

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
```

Production build:

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

Copy `.env.example` to `.env` if you want to override the data provider
settings (defaults to mock data, no setup required).

## What's implemented (Phase 1)

- **Navigation & layout**: responsive sidebar (desktop) + bottom nav (mobile),
  header with season/matchweek/last-updated info, refresh button, theme
  toggle, and team search.
- **Theme system**: persisted light/dark mode, custom design tokens (not the
  generic AI-dashboard look) — deep ink/pitch-green/amber palette, Barlow
  Condensed display type, Inter body type, IBM Plex Mono for stats, and a
  signature "stadium scoreboard" KPI strip.
- **Data architecture**: `FootballDataProvider` interface, `MockFootballProvider`
  implementation, env-var-driven provider switch (`services/football/index.ts`),
  fully typed domain model (`types/football.ts`).
- **Mock season engine**: 20 real EPL clubs, a proper round-robin scheduler
  generating a full 38-matchweek season, deterministic (seeded) scoreline
  generation weighted by team strength, and a "mock today" anchored so
  matchweeks 1-2 are complete, matchweek 3 has a live match in progress, and
  the rest of the season is scheduled.
- **Dashboard**: KPI scoreboard (matches played, goals, avg goals/game,
  leader, top scorer, next match), Today's Matches, Upcoming Fixtures, League
  Table preview, Recent Results.
- **Full standings table**: sortable columns, competition-zone highlighting
  (Champions League / Europa / Conference / Relegation) driven by editable
  config rather than hardcoded position checks, position-movement arrows,
  form strips, click-through to team pages.
- **Matches page**: Today / Upcoming / Results / All tabs, matchweek filter.
- **Teams, Team Detail, Players, Compare, Settings**: functional pages built
  ahead of schedule using the same data layer (season record, home/away
  splits, form, recent results, upcoming fixtures per team; player rankings;
  head-to-head team comparison; theme/provider/cache controls in Settings).
- **Loading, error, and empty states** throughout — no blank screens.

### Deliberately deferred to later phases
- Match detail page (goals/cards/lineups/stats) — the `Match` type and
  `getMatch()` provider method exist, but event-level mock data isn't
  generated yet.
- Analytics charts (goals trend, form ranking, points progression) — the
  page exists as a clear "coming in Phase 3" placeholder.
- Favourites, global notifications architecture, real API provider.

## How it was tested

- `npx tsc --noEmit` - clean, zero type errors.
- `npm run build` - production build succeeds (321 KB JS / 99 KB gzipped,
  32 KB CSS / 6 KB gzipped).
- `scripts/verify-mock-data.ts` (dev-only, run via `npx tsx`) - confirms the
  season generator produces exactly 380 fixtures, standings sum to 20 teams
  with sequential unique positions sorted correctly by points, and a live
  match exists on the mock "today."
- `scripts/smoke-test.tsx` (dev-only, run via `npx tsx`) - renders all 10
  routes (including the 404 fallback) in a jsdom environment through the
  real `App` route tree and confirms each produces real DOM content with no
  thrown errors. The only captured console output across all routes was a
  benign React test-harness timing notice, not an application bug.
- `vite preview` - manually verified the production build serves correct
  HTML/CSS/JS.

I was not able to run a full visual/browser check in this sandbox (headless
Chromium download was blocked by network restrictions here), so please do a
visual pass in your own browser - especially responsive breakpoints and the
live-match pulse indicator - before treating this as fully verified.

## Deploying to GitHub Pages

This repo ships with `.github/workflows/deploy.yml`, which builds and
deploys automatically on every push to `main`. One-time setup:

1. Push this project to a GitHub repository (see commands below).
2. In the repo, go to **Settings → Pages → Source** and select
   **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).
   Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

```bash
cd epl-dashboard
git init
git add .
git commit -m "Pitchside EPL dashboard - Phase 1"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Two things were already wired up so a project-site deploy (served from
`/<repo-name>/` rather than the domain root) works correctly out of the box:

- `vite.config.ts` reads a `BASE_PATH` env var for the Vite `base` option;
  the workflow sets it to `/${{ github.event.repository.name }}/`
  automatically, so **the repo name in `git remote add origin` above is
  the only thing you need to get right** — no manual edits needed.
- `npm run build` now also copies `dist/index.html` to `dist/404.html`
  (`scripts/copy-404.mjs`). GitHub Pages has no server-side rewrites, so
  without this, refreshing or directly visiting a deep link like
  `/teams/arsenal` would 404. With it, GitHub Pages serves that same
  `index.html` content for any unmatched path, and React Router picks up
  the real URL from the browser and renders the correct page.

If this repo *is* your `<username>.github.io` user/org site (served from
the domain root, not a subpath) or you're pointing a custom domain at it,
delete the `env: BASE_PATH: ...` line in the workflow — Vite's `base` will
default back to `/`.



- Add `ApiFootballProvider` implementing `FootballDataProvider` in
  `src/services/football/`, then extend the `switch` in
  `src/services/football/index.ts` - no other file needs to change.
- Match detail/event data: extend `MockFootballProvider.getMatch()` to
  generate goal/card events once needed.
- Analytics charts: Recharts is already installed; standings/fixtures data
  already has everything needed for goals trend, form ranking, and points
  progression - it's a components + page-wiring task, not a data task.

# CLAUDE.md

This file provides guidance to Claude Code (or any coding agent) working in this repository.

## Overview

Mite-mite is a personal manga/book/movie/show tracker and recommendation tool. It's a single-owner
hobby project, not a multi-tenant platform — there is no user-account system. All requirements and
design decisions come from the owner; the codebase should stay fork-friendly (no hardcoded identity,
config isolated to environment variables) so someone else could run their own independent copy.

## Stack

- **Frontend**: TypeScript, React, single-page application. Responsive and mobile-first. UI built with
  Material Tailwind (Material Design components on Tailwind CSS) and react-icons for iconography.
- **API**: GraphQL served by Apollo Server on Node.js, mediating all communication between the frontend
  and the database.
- **Database**: PostgreSQL, hosted on Neon.
- **Hosting**: not yet finalized (candidates: Railway Hobby plan, or a decoupled setup e.g. Vercel for
  the frontend). Target cost ceiling: ~$10/month, ~$5/month preferred — this is a hobby site, not a
  full-featured platform or marketplace.
- **Testing**: Jest. Functional/business logic (GraphQL resolvers, non-trivial React logic like data
  transforms and hooks) is developed test-first. Cosmetic changes and throwaway exploratory spikes are
  exempt.
- **Formatting**: Prettier, enforced for all TypeScript.

## Architecture

**API vs. web split**: the api exists primarily to be the secure layer between the browser and
PostgreSQL — database credentials and any secret API keys must never reach the browser. Third-party
APIs that require no authentication (e.g. AniList) should be called directly from the web; proxying
them through the api adds latency and boilerplate with no security benefit.

**`web/src/api/`**: browser-side API clients.
- `graphql_client.ts` — generic `gqlQuery` helper for calls to our own Apollo Server.
- Third-party API integrations live in named subdirectories (e.g. `anilist/`). Each subdirectory
  contains individual operation files (e.g. `search.ts`), a `graphql/` folder for query files, and
  an `index.ts` that re-exports the public surface. Hooks and components import from the index
  (`@/api/anilist`), not from operation files directly.

**GraphQL queries**: kept in standalone `.graphql` files, not inline strings. In the web, import
them as raw strings via Vite's `?raw` suffix (e.g. `import q from './query.graphql?raw'`). In the
api, load them with `fs.readFileSync` at startup.

**`web/src/@types/`**: TypeScript declaration files (`.d.ts`) for module shims and ambient types.
The api has a matching `src/@types/` for the same purpose.

## Conventions

- **Access control**: write/admin routes are gated by a single trusted-identity check (e.g. a shared
  secret via env var, or an OAuth login allowlisted to one identity) — not a general user-account system.
  The exact mechanism may change; the shape (one gate, no accounts table) should not.
- **Data sourcing**: prefer free, publicly available APIs for third-party data (cover art, series
  metadata, etc.) over self-hosted or paid data pipelines.
- **Enums**: TypeScript's `erasableSyntaxOnly` flag is enabled, which bans `enum`. Use `as const`
  objects with a derived union type instead:
  ```ts
  const Status = { Active: "Active", Archived: "Archived" } as const;
  type Status = (typeof Status)[keyof typeof Status];
  ```
- **Tickets**: tracked in this repo's native GitHub Projects tab, not a separate tool.
- **Project name capitalization**: the name derives from みてみて. Only the leading word is
  capitalized when it starts a sentence/heading ("Mite-mite..."); it's all-lowercase mid-sentence
  ("...built with mite-mite").

## Database

**Schema location**: `api/src/db/schema.ts` is the single source of truth for the DB shape. Two tables: `franchises` and `entries`.

**Schema management**: Use `yarn db:push` (in `api/`) during prototyping — it applies schema changes directly without generating a migration history. Once the schema stabilises, switch to `drizzle-kit generate` + `migrate` to build an audit trail from that point forward. Always use the **direct (non-pooled)** Neon connection string for both — never the PgBouncer/pooled URL.

**Array columns**: `tags`, `genres`, `staff`, and `alt_titles` are stored as `text[]` directly on `entries`. There are no lookup tables for these — all validation and grouping logic lives in the React app.

**Franchise cascade deletes**: deleting a franchise should also delete its entries, but this is enforced in the service layer rather than via a DB `CASCADE` constraint. The circular FK between `franchises.primary_entry_id` and `entries.franchise_id` makes a DB-level cascade impractical; handle it explicitly in the `FranchiseService`.

## Development

The project uses **yarn** as the package manager. Do not use npm — both workspaces have `yarn.lock`
files and should stay consistent.

**API** (`cd api`)

```bash
yarn install
yarn dev       # Apollo Server at http://localhost:4100/graphql
yarn build     # compile TypeScript to dist/
yarn start     # run compiled output
yarn lint      # eslint (TypeScript-aware, via @typescript-eslint)
yarn format    # prettier
```

**Web** (`cd web`)

```bash
yarn install
yarn dev       # Vite dev server at http://localhost:4000
yarn build     # type-check + Vite production build
yarn preview   # preview production build locally
yarn lint      # oxlint + tsc --noEmit (two-pass: fast style then type errors)
yarn format    # prettier
```

**Linter asymmetry**: the web uses `oxlint` (fast, Rust-based) as a first pass before `tsc`, while
the api uses `eslint` with `@typescript-eslint`. Don't swap them — they're intentionally different
tools suited to each workspace.

**UI copy**: all user-visible strings in the web live in `web/src/constants/strings.ts`. Add new
copy there rather than hardcoding it inline in components. This applies to sentences and labels —
single characters used as visual chrome (e.g. `×`, `?`) are exempt.

For strings with runtime values, use the `%{key}` placeholder syntax and the `translate()` helper
exported from the same file:

```ts
// strings.ts
volumeLabel: "Vol. %{n}",

// component
translate(Strings.coverPicker.volumeLabel, { n: cover.volume })
```

**File naming**: all source files use `snake_case` (e.g. `entry_form.tsx`, `use_media_query.tsx`).

**Component directory structure**: components are organized into directories named after their
route or feature area. The top-level `index.tsx` of each directory is the default export for that
route/page. Sub-routes live as subdirectories. Example:

```
components/
  admin/                    ← /admin route; default export is AdminPage
    admin_page.tsx
    index.tsx
    new_entry/              ← /admin/new_entry sub-route; default export is NewEntryPage
      new_entry_page.tsx
      index.tsx
    forms/                  ← components scoped to the admin feature area
      entry_form.tsx
  shared/                   ← layouts and hooks used across multiple routes
    not_found_page.tsx
    hooks/
      use_media_query.tsx
```

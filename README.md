# mite-mite (みてみて!)

I'm an avid manga fan and have read a ton over the years, and also find myself in situations at cons get togethers where I'm exhanging recommendations with folks and blank on a recommendation. While tools like MAL, Good Reads, ect already have tools for tracking things you've read, I feel like they are never in the right place or have the info I need at the time I need it. My goal with Mite-Mite was to make a simple single page app where I could keep track of those things myself in one place, with the format and features I wanted. It also made for a nice mini-project to wear a lot of different dev process hats.

## Getting started

**Prerequisites:** Node.js 22+, yarn, and a [Neon](https://neon.tech) PostgreSQL database (free tier is fine).

**API**

```bash
cd api
cp .env.sample .env   # fill in DATABASE_URL (direct/non-pooled Neon URL), ADMIN_SECRET
yarn install
yarn db:generate      # generate migrations from the current schema (first run only)
yarn dev              # starts Apollo Server at http://localhost:4100/graphql
```

**Web**

```bash
cd web
cp .env.sample .env   # fill in VITE_API_URL (e.g. http://localhost:4100), VITE_ADMIN_SECRET
yarn install
yarn dev              # starts Vite dev server at http://localhost:4000
```

## Deployment

The app is hosted on [Render](https://render.com) via a Blueprint (`render.yaml` at the repo root):

| Service | Type | Source |
|---|---|---|
| `mite-mite-api` | Web service (Node, free tier) | `api/` |
| `mite-mite-web` | Static site (auto-CDN) | `web/` |

DB migrations run automatically at API startup — no manual step needed on deploy.

**Environment variables** (set in the Render dashboard, never committed):

| Service | Variable | Notes |
|---|---|---|
| api | `DATABASE_URL` | Direct (non-pooled) Neon connection string with `?sslmode=require` |
| web | `VITE_API_URL` | Base URL of the api service, e.g. `https://mite-mite-api.onrender.com` |

`ADMIN_SECRET` and `VITE_ADMIN_SECRET` are intentionally omitted in production — the app runs read-only until admin auth is added (issue #13).

**To run your own instance:** fork the repo, create a Render account, connect via Blueprint, and supply your own `DATABASE_URL`. No other provider-specific setup is needed — the app is a plain Node process and a static SPA.

## Tech goals

I came to this idea with a pretty specific tech stack in mind. This is simple app using React, Typescript, GraphQL, PostGres, and some related tech.

1. Single owner, fork friendly: This app is intended to be managed by an individual or a small team, and I'd like to try to make it forkable for others to create their own collections. This ties into how auth works too - as this tool doesn't need complex auth solutions for a single user.
2. Minimal operational footprint: I wanted this thing to be cheap to run and host. My goal was to keep it down to like $5 bucks a month, or at a max of $10. So while there are some light storage needs, many things should be borrowed from public APIs.
3. Mobile first: I am going to be usually using this when talking to someone and wanting to share a series with them. While the data entry may happen on desktop, the whole thing needs to be 100% responsive.

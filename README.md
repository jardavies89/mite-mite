# mite-mite (みてみて!)

I'm an avid manga fan and have read a ton over the years, and also find myself in situations at cons get togethers where I'm exhanging recommendations with folks and blank on a recommendation. While tools like MAL, Good Reads, ect already have tools for tracking things you've read, I feel like they are never in the right place or have the info I need at the time I need it. My goal with Mite-Mite was to make a simple single page app where I could keep track of those things myself in one place, with the format and features I wanted. It also made for a nice mini-project to wear a lot of different dev process hats.

## Getting started

**Prerequisites:** Node.js 20+, a [Neon](https://neon.tech) PostgreSQL database, and a free [TMDB API key](https://developer.themoviedb.org/docs/getting-started).

**API**

```bash
cd api
cp .env.sample .env   # fill in DATABASE_URL, TMDB_API_KEY, ADMIN_SECRET
yarn install
yarn dev              # starts Apollo Server at http://localhost:4100/graphql
```

**Web**

```bash
cd web
cp .env.sample .env   # fill in VITE_API_URL, VITE_ADMIN_SECRET
yarn install
yarn dev              # starts Vite dev server at http://localhost:4000
```

## Tech goals

I came to this idea with a pretty specific tech stack in mind. This is simple app using React, Typescript, GraphQL, PostGres, and some related tech.

1. Single owner, fork friendly: This app is intended to be managed by an individual or a small team, and I'd like to try to make it forkable for others to create their own collections. This ties into how auth works too - as this tool doesn't need complex auth solutions for a single user.
2. Minimal operational footprint: I wanted this thing to be cheap to run and host. My goal was to keep it down to like $5 bucks a month, or at a max of $10. So while there are some light storage needs, many things should be borrowed from public APIs.
3. Mobile first: I am going to be usually using this when talking to someone and wanting to share a series with them. While the data entry may happen on desktop, the whole thing needs to be 100% responsive.

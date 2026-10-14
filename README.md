# movies

A movie browsing app built with Bun, React, React Router and TanStack Query. Browse popular and trending movies, search titles, filter by genre, view movie details, and manage a personal watchlist with keyboard navigation. The Bun server proxies the TMDB API and caches responses.

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.4.2. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Docker

Build and run:

```bash
docker build -t movies .
docker run --env-file .env -p 3000:3000 movies
```

import type { MovieFilters } from "@/types";
import cache from "@/server/services/cache";

import { getGenreOptions as fetchGenreOptions } from "@/server/tmdb";
import { getMovieById as fetchMovieById } from "@/server/tmdb";
import { getMovies as fetchMovies } from "@/server/tmdb";
const GENRES_KEY = "genres";

function moviesKey(filters: MovieFilters): string {
  return [
    "movies",
    filters.q ?? "",
    filters.genreIds?.join(",") ?? "",
    filters.page ?? 1,
  ].join("|");
}

function parseFilters(req: Bun.BunRequest): MovieFilters {
  const params = new URL(req.url).searchParams;

  return {
    q: params.get("q") ?? undefined,
    genreIds: params
      .get("genres")
      ?.split(",")
      .map(Number)
      .filter(Number.isFinite),
    page: params.get("page") ? Number(params.get("page")) : undefined,
  };
}

export async function handleMovies(req: Bun.BunRequest) {
  const filters = parseFilters(req);
  const cacheControl = filters.q
    ? "no-store"
    : "public, max-age=60, stale-while-revalidate=300";

  const key = moviesKey(filters);
  const cached = cache.get(key);
  if (cached) {
    return Response.json(cached, {
      headers: { "Cache-Control": cacheControl },
    });
  }

  try {
    const movies = await fetchMovies(filters);
    cache.store(key, movies);
    return Response.json(movies, {
      headers: { "Cache-Control": cacheControl },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : e;

    return Response.json({ error: message }, { status: 500 });
  }
}

export async function handleMovieById(req: Bun.BunRequest) {
  const id = Number(req.params.id as string);

  if (!Number.isFinite(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const key = `movie:${id}`;
  const cached = cache.get(key);
  if (cached) {
    return Response.json(cached, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  }

  try {
    const movie = await fetchMovieById(id);
    if (!movie) return Response.json({ error: "Not found" }, { status: 404 });
    cache.store(key, movie);
    return Response.json(movie, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : e;
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function handleGenres() {
  const cached = cache.get(GENRES_KEY);
  if (cached) {
    return Response.json(cached, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const genres = await fetchGenreOptions();
    cache.store(GENRES_KEY, genres);
    return Response.json(genres, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const message = e instanceof Error ? e.message : e;

    return Response.json({ error: message }, { status: 500 });
  }
}

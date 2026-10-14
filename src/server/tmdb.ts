import bfetch from "@/server/utils/fetch";
import type {
  GenreOption,
  Movie,
  MovieFilters,
  MoviePage,
  TmdbDiscoverResponse,
  TmdbGenresResponse,
  TmdbMovie,
} from "@/types";

const BASE = "https://api.themoviedb.org/3";
const TOKEN = process.env.TMDB_TOKEN;

const GENRE_FALLBACK = "OTHER";
const HEADERS = { Authorization: `Bearer ${TOKEN}` };
export const MAX_PAGE = 500;

let genreMap: Map<number, string> | null = null;

const getURL = (endpoint: string) => new URL(endpoint, `${BASE}/`);

async function getGenreMap(): Promise<Map<number, string>> {
  if (genreMap) return genreMap;

  const data = (await bfetch(`${BASE}/genre/movie/list?language=en-US`, {
    headers: HEADERS,
  })) as TmdbGenresResponse;

  genreMap = new Map(data.genres.map((g) => [g.id, g.name]));
  return genreMap;
}

function buildDiscoverUrl(filters: MovieFilters = {}): URL {
  const url = getURL("discover/movie");
  const requested = filters.page ?? 1;
  const page = Number.isFinite(requested)
    ? Math.min(Math.max(1, Math.trunc(requested)), MAX_PAGE)
    : 1;

  url.searchParams.set("include_adult", "false");
  url.searchParams.set("include_video", "false");
  url.searchParams.set("language", "en-US");
  url.searchParams.set("page", String(page));
  url.searchParams.set("sort_by", "popularity.desc");

  if (filters.q) url.searchParams.set("with_text_query", filters.q);
  if (filters.genreIds?.length) {
    url.searchParams.set("with_genres", filters.genreIds.join(","));
  }

  return url;
}

async function discover(filters: MovieFilters): Promise<TmdbDiscoverResponse> {
  return bfetch(buildDiscoverUrl(filters), {
    headers: HEADERS,
  }) as Promise<TmdbDiscoverResponse>;
}

function mapMovie(raw: TmdbMovie, genres: Map<number, string>): Movie {
  const movieGenres = raw.genre_ids
    .map((id) => genres.get(id) ?? GENRE_FALLBACK)
    .filter((g, i, arr) => arr.indexOf(g) === i);

  return {
    id: raw.id,
    title: raw.title.toUpperCase(),
    year: Number(raw.release_date?.slice(0, 4)) || 0,
    director: "N/A",
    duration: 0,
    genres: movieGenres,
    rating: raw.vote_average ?? 0,
    desc: raw.overview ?? "",
    poster: raw.poster_path ?? "",
    backdrop: raw.backdrop_path ?? "",
  };
}

export async function getMovies(
  filters: MovieFilters = {},
): Promise<MoviePage> {
  const [data, genres] = await Promise.all([discover(filters), getGenreMap()]);

  return {
    results: data.results.map((raw) => mapMovie(raw, genres)),
    page: data.page,
    totalPages: Math.min(data.total_pages, MAX_PAGE),
    totalResults: data.total_results,
  };
}

export async function getMovieById(id: number): Promise<Movie | null> {
  const genres = await getGenreMap();
  const data = (await bfetch(`${BASE}/movie/${id}?language=en-US`, {
    headers: HEADERS,
  })) as TmdbMovie & { genres?: { id: number; name: string }[] };

  return {
    id: data.id,
    title: data.title.toUpperCase(),
    year: Number(data.release_date?.slice(0, 4)) || 0,
    director: "N/A",
    duration: 0,
    genres:
      data.genres?.map((g) => g.name) ??
      data.genre_ids?.map((gid) => genres.get(gid) ?? GENRE_FALLBACK) ??
      [],
    rating: data.vote_average ?? 0,
    desc: data.overview ?? "",
    poster: data.poster_path ?? "",
    backdrop: data.backdrop_path ?? "",
  };
}

export async function getGenreOptions(): Promise<GenreOption[]> {
  const genres = await getGenreMap();

  return [...genres]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

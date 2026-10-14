import type { GenreOption, Movie, MovieFilters, MoviePage } from "@/types";

function toQueryString(filters: MovieFilters): string {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.genreIds?.length) params.set("genres", filters.genreIds.join(","));
  if (filters.page != null) params.set("page", String(filters.page));

  return params.toString();
}

export async function getMovies(filters: MovieFilters = {}): Promise<MoviePage> {
  const res = await fetch(`/api/movies?${toQueryString(filters)}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch movies: ${res.status}`);
  }

  return res.json();
}

export async function getGenres(): Promise<GenreOption[]> {
  const res = await fetch("/api/genres");

  if (!res.ok) {
    throw new Error(`Failed to fetch genres: ${res.status}`);
  }

  return res.json();
}

export async function getMovieById(id: number): Promise<Movie> {
  const res = await fetch(`/api/movies/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch movie ${id}: ${res.status}`);
  }

  return res.json();
}

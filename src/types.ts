export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  duration: number;
  genres: string[];
  rating: number;
  desc: string;
  poster: string;
  backdrop: string;
}

export interface GenreOption {
  id: number;
  name: string;
}

export interface MovieFilters {
  q?: string;
  genreIds?: number[];
  page?: number;
}

export interface MoviePage {
  results: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  adult: boolean;
  video: boolean;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbDiscoverResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbMovie[];
}

export interface TmdbGenresResponse {
  genres: TmdbGenre[];
}

import { useSearchParams } from "react-router";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import type { MovieFilters } from "@/types";

function parseGenreIds(value: string | null): number[] {
  if (!value) return [];
  return value
    .split(",")
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
}

export function useMovieFilters(debounceMs = 400) {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const genreIds = parseGenreIds(searchParams.get("genres"));
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const debouncedQuery = useDebouncedValue(query, debounceMs);

  const filters: MovieFilters = {
    q: debouncedQuery || undefined,
    genreIds,
    page,
  };

  const hasFilters = debouncedQuery.length > 0 || genreIds.length > 0;

  const updateParams = (
    mutate: (params: URLSearchParams) => void,
    options?: { replace?: boolean },
  ) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next, options);
  };

  const onQueryChange = (value: string) => {
    updateParams(
      (params) => {
        if (value) params.set("q", value);
        else params.delete("q");
        params.delete("page");
      },
      { replace: true },
    );
  };

  const toggleGenre = (genreId: number) => {
    updateParams((params) => {
      const next = new Set(genreIds);
      if (next.has(genreId)) next.delete(genreId);
      else next.add(genreId);
      const sorted = [...next].sort((a, b) => a - b);
      if (sorted.length) params.set("genres", sorted.join(","));
      else params.delete("genres");
      params.delete("page");
    });
  };

  const onClearGenres = () => {
    updateParams((params) => {
      params.delete("genres");
      params.delete("page");
    });
  };

  const goToPage = (nextPage: number) => {
    updateParams((params) => {
      if (nextPage > 1) params.set("page", String(nextPage));
      else params.delete("page");
    });
  };

  return {
    query,
    genreIds,
    page,
    debouncedQuery,
    filters,
    hasFilters,
    onQueryChange,
    toggleGenre,
    onClearGenres,
    goToPage,
  };
}

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGenres, getMovies } from "@/api/movies";
import { useMovieFilters } from "@/hooks/useMovieFilters";
import { useWatchlist } from "@/context/watchlist";
import { useMovieKeyboardNav } from "@/hooks/useMovieKeyboardNav";
import { setHoveredId } from "@/hooks/useHoveredId";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Detail from "@/components/Detail";
import HoverPoster from "@/components/HoverPoster";
import MovieTable from "@/components/MovieTable";
import Pager from "@/components/Pager";
import HomeFooter from "@/components/HomeFooter";
import {
  CatalogError,
  CatalogHead,
  CatalogLoading,
} from "@/components/CatalogHead";
import useKeyboard from "@/hooks/useKeyboard";

function Home() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { watchlist, toggleWatchlist } = useWatchlist();

  const {
    query,
    genreIds,
    page,
    filters,
    hasFilters,
    onQueryChange,
    toggleGenre,
    onClearGenres,
    goToPage,
  } = useMovieFilters();

  const { data, isFetching, status } = useQuery({
    queryKey: ["movies", filters],
    queryFn: () => getMovies(filters),
    placeholderData: (previous) => previous,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  const selectedMovie = useMemo(
    () =>
      selectedId != null
        ? (movies.find((m) => m.id === selectedId) ?? null)
        : null,
    [selectedId, movies],
  );

  useMovieKeyboardNav({ movies, selectedId, setSelectedId });

  useKeyboard({
    onKeyDown: (e) => {
      const { key } = e;

      if (key === "ArrowRight" && page < totalPages) {
        goToPage(page + 1);
      } else if (key === "ArrowLeft" && page > 1) {
        goToPage(page - 1);
      }
    },
  });

  return (
    <div className="shell">
      <Header
        count={movies.length}
        filtered={hasFilters}
        watchlistSize={watchlist.size}
      />

      <Sidebar
        query={query}
        onQueryChange={onQueryChange}
        genres={genres}
        selectedGenres={new Set(genreIds)}
        onToggleGenre={toggleGenre}
        onClearGenres={onClearGenres}
      />

      <HoverPoster movies={movies} />

      <main>
        <CatalogHead
          isLoading={status === "pending"}
          isError={status === "error"}
          count={movies.length}
          page={page}
          totalPages={totalPages}
        />

        {status === "pending" ? (
          <CatalogLoading />
        ) : status === "error" ? (
          <CatalogError />
        ) : (
          <>
            <MovieTable
              movies={movies}
              selectedId={selectedId}
              watchlist={watchlist}
              onSelect={setSelectedId}
              onHover={setHoveredId}
            />
            <Pager
              page={page}
              totalPages={totalPages}
              isFetching={isFetching}
              onGoToPage={goToPage}
            />
          </>
        )}
      </main>

      <Detail
        movie={selectedMovie}
        inList={selectedMovie ? watchlist.has(selectedMovie.id) : false}
        onToggleList={() => selectedMovie && toggleWatchlist(selectedMovie.id)}
        onClose={() => setSelectedId(null)}
      />

      <HomeFooter filtered={hasFilters} count={movies.length} />
    </div>
  );
}

export default Home;

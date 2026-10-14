import { useState } from "react";
import { Link } from "react-router";
import { useQueries } from "@tanstack/react-query";
import { getMovieById } from "@/api/movies";
import { useWatchlist } from "@/context/watchlist";
import Header from "@/components/Header";
import MovieTable from "@/components/MovieTable";

function Watchlist() {
  const { watchlist, addedAt, toggleWatchlist } = useWatchlist();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const ids = [...watchlist];

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["movie", id],
      queryFn: () => getMovieById(id),
      staleTime: Infinity,
      placeholderData: (previous: any) => previous,
    })),
  });

  const movies = results
    .map((r) => r.data)
    .filter((m) => m != null)
    .sort((a, b) => (addedAt[b!.id] ?? 0) - (addedAt[a!.id] ?? 0));
  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  return (
    <div className="shell">
      <Header
        count={movies.length}
        filtered={false}
        watchlistSize={watchlist.size}
      />

      <main style={{ gridColumn: "2 / -1" }}>
        <div className="main-head">
          <span>WATCHLIST / SAVED TITLES</span>
          <span>
            <Link to="/">← BACK TO CATALOG</Link>
          </span>
        </div>

        {ids.length === 0 ? (
          <div className="detail-empty" style={{ flex: 1 }}>
            <div>
              <h2>EMPTY</h2>
              <div style={{ fontSize: 10, letterSpacing: "0.12em" }}>
                NO SAVED TITLES
                <br />
                <Link to="/">BROWSE CATALOG</Link>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div
            className="detail-empty"
            style={{ flex: 1, textAlign: "center", paddingBlock: "1em" }}
          >
            RETRIEVING INDEX…
          </div>
        ) : isError ? (
          <div
            className="detail-empty"
            style={{ flex: 1, textAlign: "center", paddingBlock: "1em" }}
          >
            API UNREACHABLE — RELOAD TO RETRY
          </div>
        ) : (
          <MovieTable
            movies={movies}
            selectedId={selectedId}
            watchlist={watchlist}
            onSelect={setSelectedId}
            onHover={() => {}}
            addedAt={addedAt}
            showAddedAt
            isWatchable
          />
        )}

        {ids.length > 0 && !isLoading && !isError && (
          <div className="pager">
            <span>
              {movies.length} SAVED — CLICK ROW TO SELECT, USE DETAIL TO REMOVE
            </span>
            {selectedId != null && (
              <button
                className="page-btn"
                onClick={() => toggleWatchlist(selectedId)}
              >
                REMOVE SELECTED
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Watchlist;

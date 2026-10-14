import { useState } from "react";
import type { Movie } from "@/types";
import Title from "@/components/Title";
import WatchModal from "@/components/WatchModal";

interface MovieTableProps {
  movies: Movie[];
  selectedId: number | null;
  watchlist: Set<number>;
  onSelect: (id: number) => void;
  onHover: (id: number) => void;
  addedAt?: Record<number, number>;
  showAddedAt?: boolean;
  isWatchable?: boolean;
}

function MovieTable({
  movies,
  selectedId,
  watchlist,
  onSelect,
  onHover,
  addedAt,
  showAddedAt,
  isWatchable,
}: MovieTableProps) {
  const [watchId, setWatchId] = useState<number | null>(null);
  const watching = movies.find((m) => m.id === watchId) ?? null;

  function handleWatch(id: number) {
    setWatchId(id);
  }

  return (
    <>
      <table className="title-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Rat</th>
            {showAddedAt && <th>Added</th>}
          </tr>
        </thead>
        <tbody>
          {movies.map((m) => (
            <Title
              key={m.id}
              title={m}
              selected={m.id === selectedId}
              onSelect={onSelect}
              inList={watchlist.has(m.id)}
              onHover={() => onHover(m.id)}
              addedAt={addedAt?.[m.id]}
              showAddedAt={showAddedAt}
              isWatchable={isWatchable}
              onWatch={handleWatch}
            />
          ))}
        </tbody>
      </table>

      <WatchModal movie={watching} onClose={() => setWatchId(null)} />
    </>
  );
}

export default MovieTable;

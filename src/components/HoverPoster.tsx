import useMouseCoords from "@/hooks/useMouseCoords";
import { useHoveredId } from "@/hooks/useHoveredId";
import type { Movie } from "@/types";

interface HoverPosterProps {
  movies: Movie[];
}

function HoverPoster({ movies }: HoverPosterProps) {
  const { coords } = useMouseCoords();
  const hoveredId = useHoveredId();
  const poster =
    hoveredId === null ? null : (movies.find((m) => m.id === hoveredId)?.poster ?? null);

  return (
    <div
      className="active-poster"
      style={{ top: coords.y, left: coords.x }}
      data-visible={!!poster}
    >
      {poster && <img src={`https://image.tmdb.org/t/p/w500/${poster}`} alt="" />}
    </div>
  );
}

export default HoverPoster;
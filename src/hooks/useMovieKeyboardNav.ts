import type { Movie } from "@/types";
import useKeyboard from "@/hooks/useKeyboard";

interface UseMovieKeyboardNavProps {
  movies: Movie[];
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
}

export function useMovieKeyboardNav({
  movies,
  selectedId,
  setSelectedId,
}: UseMovieKeyboardNavProps) {
  useKeyboard({
    onKeyDown: (e) => {
      if (movies.length === 0) return;

      const idx = movies.findIndex((m) => m.id === selectedId);

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(movies.length - 1, idx + 1);
        setSelectedId(movies[next]!.id);
      }
      if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(0, idx - 1);
        setSelectedId(movies[prev]!.id);
      }
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    },
  });
}

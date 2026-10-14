import type { GenreOption } from "@/types";

interface SidebarProps {
  query: string;
  onQueryChange: (value: string) => void;
  genres: GenreOption[];
  selectedGenres: Set<number>;
  onToggleGenre: (genreId: number) => void;
  onClearGenres: () => void;
}

function Sidebar({
  query,
  onQueryChange,
  genres,
  selectedGenres,
  onToggleGenre,
  onClearGenres,
}: SidebarProps) {
  return (
    <aside>
      <div className="block">
        <div className="label">
          <span>Search</span>
          <span>⌕</span>
        </div>
        <input
          type="text"
          placeholder="TITLE / DIRECTOR / YEAR"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <div className="block">
        <div className="label">
          <span>Genre</span>
          <span className="genre-clear" onClick={onClearGenres}>
            CLR
          </span>
        </div>
        <div className="genres">
          {genres.map((g) => (
            <div
              key={g.id}
              className={`genre-row ${selectedGenres.has(g.id) ? "active" : ""}`}
              onClick={() => onToggleGenre(g.id)}
            >
              <span>[{g.name}]</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

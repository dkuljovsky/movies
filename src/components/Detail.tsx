import type { Movie } from "@/types";
import DetailEmpty from "@/components/DetailEmpty";

interface DetailProps {
  movie: Movie | null;
  inList: boolean;
  onToggleList: () => void;
  onClose: () => void;
}

function Detail({ movie, inList, onToggleList, onClose }: DetailProps) {
  if (!movie) {
    return <DetailEmpty />;
  }

  const bars =
    "█".repeat(Math.round(movie.rating)) +
    "░".repeat(10 - Math.round(movie.rating));

  return (
    <div className="detail">
      {movie.backdrop && (
        <div className="detail-image">
          <img src={`https://image.tmdb.org/t/p/w500/${movie.backdrop}`} />
        </div>
      )}
      <div className="detail-content">
        <div className="detail-hero">
          <div className="meta-top">{movie.year}</div>
          <h1>{movie.title}</h1>
          <div className="sub">
            {movie.genres.join(" / ")} — RATING {movie.rating.toFixed(1)}/10
          </div>
        </div>

        <div className="detail-table">
          <div className="row">
            <div className="k">Year</div>
            <div className="v">{movie.year}</div>
          </div>
          <div className="row">
            <div className="k">Genres</div>
            <div className="v">
              {movie.genres.map((g) => `[${g}]`).join(" ")}
            </div>
          </div>
        </div>

        <div className="detail-body">
          <p>{movie.desc.toUpperCase()}</p>
        </div>

        <div className="detail-actions">
          <button className="btn" onClick={onToggleList}>
            {inList ? "REMOVE FROM LIST" : "ADD TO WATCHLIST"}
          </button>
          <button className="btn ghost" onClick={onClose}>
            CLOSE
          </button>
        </div>

        <div className="rating-visual">
          {bars} &nbsp; {movie.rating.toFixed(1)} — {movie.title}
        </div>
      </div>
    </div>
  );
}

export default Detail;

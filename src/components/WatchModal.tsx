import { useEffect, useRef } from "react";
import type { Movie } from "@/types";
import useClickOutside from "@/hooks/useClickOutside";

interface WatchModalProps {
  movie: Movie | null;
  onClose: () => void;
}

function createIframeUrl(movieId?: number): string | null {
  if (!movieId) return null;

  const url = new URL("https://multiembed.mov/");
  url.searchParams.append("video_id", movieId.toString());
  url.searchParams.append("tmdb", "1");
  return url.toString();
}

function WatchModal({ movie, onClose }: WatchModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = movie !== null;

  useClickOutside(dialogRef, (e) => {
    if (e.target === dialogRef.current) onClose();
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const iframeURL = createIframeUrl(movie?.id);

  return (
    <dialog ref={dialogRef} onClose={onClose} className="watch-modal">
      {movie && (
        <div className="watch-modal-body">
          <header>
            <div className="watch-modal-meta">
              <span>{movie.year}</span>
              <span>{movie.genres.join(" / ")}</span>
              <span>{movie.rating.toFixed(1)}</span>
            </div>
            <h2>{movie.title}</h2>
          </header>

          <div className="watch-modal-player">
            {iframeURL && (
              <iframe
                src={iframeURL}
                width="100%"
                height="100%"
                allowFullScreen
                style={{ border: "none" }}
              />
            )}
          </div>

          <p className="watch-modal-desc">{movie.desc.toUpperCase()}</p>

          <div className="watch-modal-actions">
            <button className="btn ghost" onClick={onClose}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

export default WatchModal;

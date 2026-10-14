interface PagerProps {
  page: number;
  totalPages: number;
  isFetching: boolean;
  onGoToPage: (page: number) => void;
}

function Pager({ page, totalPages, isFetching, onGoToPage }: PagerProps) {
  return (
    <div className="pager">
      <button
        className="page-btn"
        disabled={page <= 1 || isFetching}
        onClick={() => onGoToPage(Math.max(1, page - 1))}
      >
        ← PREV
      </button>
      <span>
        PAGE {page} / {totalPages}
      </span>
      <button
        className="page-btn"
        disabled={page >= totalPages || isFetching}
        onClick={() => onGoToPage(Math.min(totalPages, page + 1))}
      >
        NEXT →
      </button>
    </div>
  );
}

export default Pager;

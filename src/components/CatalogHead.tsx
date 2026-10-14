interface CatalogHeadProps {
  isLoading: boolean;
  isError: boolean;
  count: number;
  page: number;
  totalPages: number;
}

export function CatalogHead({ isLoading, isError, count, page, totalPages }: CatalogHeadProps) {
  return (
    <div className="main-head">
      <span>CATALOG / GRID VIEW</span>
      <span>
        {isLoading
          ? "LOADING"
          : isError
            ? "CONNECTION ERROR"
            : `SHOWING ${count} · PAGE ${page} / ${totalPages}`}
      </span>
    </div>
  );
}

export function CatalogLoading() {
  return (
    <div className="detail-empty" style={{ flex: 1 }}>
      <div>RETRIEVING INDEX…</div>
    </div>
  );
}

export function CatalogError() {
  return (
    <div className="detail-empty" style={{ flex: 1 }}>
      <div>
        <h2>404</h2>
        <div style={{ fontSize: 10, letterSpacing: "0.12em" }}>
          API UNREACHABLE
          <br />
          RELOAD TO RETRY
        </div>
      </div>
    </div>
  );
}

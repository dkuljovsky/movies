import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "movies:watchlist";

export type WatchlistMap = Record<number, number>;

interface WatchlistValue {
  watchlist: Set<number>;
  addedAt: WatchlistMap;
  toggleWatchlist: (id: number) => void;
}

export const WatchlistContext = createContext<WatchlistValue | null>(null);

function loadWatchlist(): WatchlistMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const now = Date.now();
      return Object.fromEntries(
        parsed.filter((id) => typeof id === "number").map((id) => [id, now]),
      );
    }
    if (typeof parsed === "object" && parsed !== null) {
      const entries = Object.entries(parsed as Record<string, unknown>).filter(
        ([k, v]) => Number.isFinite(Number(k)) && typeof v === "number",
      );
      return Object.fromEntries(entries.map(([k, v]) => [Number(k), v as number]));
    }
    return {};
  } catch {
    return {};
  }
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WatchlistMap>(loadWatchlist);

  const watchlist = useMemo(() => new Set(Object.keys(entries).map(Number)), [entries]);

  const toggleWatchlist = (id: number) => {
    setEntries((prev) => {
      if (prev[id] != null) {
        const { [id]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: Date.now() };
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // quota exceeded or unavailable — watchlist stays in memory
    }
  }, [entries]);

  const value = useMemo(
    () => ({ watchlist, addedAt: entries, toggleWatchlist }),
    [watchlist, entries],
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist(): WatchlistValue {
  const ctx = useContext(WatchlistContext);
  if (ctx === null) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return ctx;
}

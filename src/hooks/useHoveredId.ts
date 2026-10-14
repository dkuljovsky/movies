import { useSyncExternalStore } from "react";

let hoveredId: number | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return hoveredId;
}

export function setHoveredId(id: number | null) {
  if (hoveredId === id) return;
  hoveredId = id;
  for (const listener of listeners) listener();
}

export function useHoveredId(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
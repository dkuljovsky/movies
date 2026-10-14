import { useEffect, useRef } from "react";

interface UseKeyboardOptions {
  onKeyDown: (e: KeyboardEvent) => void;
  ignoreEditable?: boolean;
}

function useKeyboard({ onKeyDown, ignoreEditable = true }: UseKeyboardOptions) {
  const handlerRef = useRef(onKeyDown);
  handlerRef.current = onKeyDown;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (ignoreEditable) {
        const t = e.target as HTMLElement | null;
        if (t?.closest?.('input, textarea, select, [contenteditable="true"]')) {
          return;
        }
      }
      handlerRef.current(e);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}

export default useKeyboard;

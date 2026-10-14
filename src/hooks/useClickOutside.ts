import { useEffect, useRef, type RefObject } from "react";

function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  clickHandler: (e: MouseEvent) => void,
) {
  const handler = useRef(clickHandler);
  handler.current = clickHandler;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const onClick = (e: MouseEvent) => handler.current(e);
    element.addEventListener("click", onClick);
    return () => {
      element.removeEventListener("click", onClick);
    };
  }, [ref]);
}

export default useClickOutside;

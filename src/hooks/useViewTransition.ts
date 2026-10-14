import { flushSync } from "react-dom";

type TransitionFunc = (update: () => void) => void;

function useViewTransition(): TransitionFunc {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => void;
  };

  return (update: () => void) => {
    if (typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => flushSync(update));
    } else {
      update();
    }
  };
}

export default useViewTransition;

import { useEffect, useState } from "react";

function useMouseCoords() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setCoords({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return { coords };
}

export default useMouseCoords;

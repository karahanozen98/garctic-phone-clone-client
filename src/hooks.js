import { useEffect, useState } from "react";
import { CANVAS_WIDTH } from "./constants";

export const useWindowSize = () => {
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: window.innerWidth <= 640 ? 1 : 0.9,
  });

  const [size, setSize] = useState(getSize);

  const onResize = () => setSize(getSize);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
};

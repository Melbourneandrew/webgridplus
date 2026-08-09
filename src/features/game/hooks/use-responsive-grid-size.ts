"use client";

import { useEffect, useState } from "react";

export const DESKTOP_GRID_SIZE = 30;
export const COMPACT_GRID_SIZE = 12;
export const COMPACT_GRID_QUERY = "(max-width: 900px), (max-height: 600px)";

export function useResponsiveGridSize() {
  const [size, setSize] = useState(DESKTOP_GRID_SIZE);

  useEffect(() => {
    const media = window.matchMedia(COMPACT_GRID_QUERY);
    const update = () => setSize(media.matches ? COMPACT_GRID_SIZE : DESKTOP_GRID_SIZE);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return size;
}

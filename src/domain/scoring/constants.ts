export const BITS_PER_SECOND_MIN = 0;
export const NTCP_DISPLAY_DECIMALS = 0;
export const BPS_DISPLAY_DECIMALS = 2;
export const DEFAULT_REGULAR_MODE_SECONDS = 60;
export const DEFAULT_BLITZ_MODE_SECONDS = 15;
export const DEFAULT_GAMEGRID_SIZE = 30;

export const GRID_CELLS_REGULAR = DEFAULT_GAMEGRID_SIZE * DEFAULT_GAMEGRID_SIZE;
export const GRID_CELLS_BLITZ = DEFAULT_GAMEGRID_SIZE * DEFAULT_GAMEGRID_SIZE;

export const BITS_PER_TARGET_CONSTANT = (gridSize: number): number => {
  const cellCount = gridSize * gridSize;
  if (cellCount <= 1) {
    throw new Error(`Invalid grid size ${gridSize} for score constants`);
  }

  return Math.log2(cellCount - 1);
};

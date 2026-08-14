export const MIN_GRID_DIMENSION = 1;

export interface GridCell {
  row: number;
  col: number;
}

export interface GridConfig {
  size: number;
}

export const gridCellCount = (size: number): number => {
  if (!Number.isFinite(size) || !Number.isInteger(size) || size < MIN_GRID_DIMENSION) {
    throw new Error(`Invalid grid size "${size}"`);
  }

  return size * size;
}

export const isGridCellValid = (size: number, cell: GridCell): boolean => {
  return Number.isInteger(cell.row) &&
    Number.isInteger(cell.col) &&
    cell.row >= 1 &&
    cell.row <= size &&
    cell.col >= 1 &&
    cell.col <= size;
};

export const flattenCell = (cell: GridCell, size: number): number => {
  if (!isGridCellValid(size, cell)) {
    throw new Error(`Invalid grid cell [${cell.row}, ${cell.col}] for size ${size}`);
  }

  return (cell.col - 1) * size + (cell.row - 1);
}

export const unflattenCell = (index: number, size: number): GridCell => {
  if (!Number.isInteger(index) || index < 0 || index >= gridCellCount(size)) {
    throw new Error(`Invalid cell index "${index}" for size ${size}`);
  }

  return {
    row: (index % size) + 1,
    col: Math.floor(index / size) + 1,
  };
};

export const isSameCell = (left: GridCell, right: GridCell): boolean =>
  left.row === right.row && left.col === right.col;

export const pickRandomCell = (size: number, rng: () => number = Math.random): GridCell => {
  if (!Number.isFinite(size) || !Number.isInteger(size) || size < MIN_GRID_DIMENSION) {
    throw new Error(`Invalid grid size "${size}"`);
  }

  const cellCount = gridCellCount(size);
  if (cellCount === 1) {
    return { row: 1, col: 1 };
  }

  const raw = Math.floor(rng() * cellCount);
  return unflattenCell(raw, size);
};

export const pickDifferentCell = (size: number, previous: GridCell, rng: () => number = Math.random): GridCell => {
  if (size === 1) {
    return { row: 1, col: 1 };
  }

  if (!isGridCellValid(size, previous)) {
    throw new Error(`Invalid previous grid cell for size ${size}`);
  }

  let next = pickRandomCell(size, rng);
  while (isSameCell(next, previous)) {
    next = pickRandomCell(size, rng);
  }

  return next;
};

export const gridDimensionFromMode = (modeGridSize: number): number => {
  if (modeGridSize <= 0) {
    throw new Error(`Invalid grid size "${modeGridSize}"`);
  }

  return modeGridSize;
};

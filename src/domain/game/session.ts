import { gameModeByName, type GameModeName } from "./modes";
import { isGridCellValid, pickDifferentCell, type GridCell } from "./grid";

export interface GameState {
  mode: GameModeName;
  gridSize: number;
  isGameStarted: boolean;
  isGameOver: boolean;
  secondsLeft: number;
  endsAtMs: number | null;
  activeCell: GridCell;
  correctClicks: number;
  incorrectClicks: number;
}

const createInitialActiveCell = (gridSize: number): GridCell => {
  const mid = Math.floor(gridSize / 2);

  return {
    row: mid + 1,
    col: mid + 1,
  };
};

export const createGameState = (mode: GameModeName, gridSize = gameModeByName[mode].gridSize): GameState => {
  const gridConfig = gameModeByName[mode];
  return {
    mode,
    gridSize,
    isGameStarted: false,
    isGameOver: false,
    secondsLeft: gridConfig.timeSeconds,
    endsAtMs: null,
    activeCell: createInitialActiveCell(gridSize),
    correctClicks: 0,
    incorrectClicks: 0,
  };
};

export function createGridGameState(mode: GameModeName, gridSize?: number): GameState {
  return createGameState(mode, gridSize);
}

export const syncSessionClock = (state: GameState, nowMs: number): GameState => {
  if (state.isGameOver || !state.isGameStarted) {
    return state;
  }

  const endsAtMs = state.endsAtMs ?? nowMs + state.secondsLeft * 1000;
  const nextSecondsLeft = Math.max(0, Math.ceil((endsAtMs - nowMs) / 1000));
  if (nextSecondsLeft > 0) {
    return { ...state, endsAtMs, secondsLeft: nextSecondsLeft };
  }

  return {
    ...state,
    secondsLeft: 0,
    endsAtMs,
    isGameOver: true,
    isGameStarted: false,
  };
};

export type TargetSelector = (size: number, previous: GridCell) => GridCell;

export const resolveTargetMove = (
  state: GameState,
  nextTarget: TargetSelector = (size, previous) => pickDifferentCell(size, previous)
): GameState => {
  if (state.isGameOver) {
    return state;
  }

  return {
    ...state,
    activeCell: nextTarget(state.gridSize, state.activeCell),
  };
};

export const registerCellClick = (
  state: GameState,
  clickRow: number,
  clickCol: number,
  selectNextTarget: TargetSelector = (size, previous) => pickDifferentCell(size, previous),
  nowMs = Date.now(),
): GameState => {
  if (state.isGameOver) {
    return state;
  }

  const startedState = state.isGameStarted ? state : {
    ...state,
    isGameStarted: true,
    endsAtMs: nowMs + state.secondsLeft * 1000,
  };
  const clickCell = { row: clickRow, col: clickCol };

  if (!isGridCellValid(state.gridSize, clickCell)) {
    return {
      ...startedState,
      incorrectClicks: startedState.incorrectClicks + 1,
    };
  }

  const isCorrect = clickCell.row === startedState.activeCell.row &&
    clickCell.col === startedState.activeCell.col;

  if (isCorrect) {
    return {
      ...resolveTargetMove(startedState, selectNextTarget),
      correctClicks: startedState.correctClicks + 1,
    };
  }

  return {
    ...startedState,
    incorrectClicks: startedState.incorrectClicks + 1,
  };
};

export const resetSession = (state: GameState, nextMode?: GameModeName, gridSize = state.gridSize): GameState => {
  const mode = nextMode ?? state.mode;
  return createGridGameState(mode, gridSize);
};

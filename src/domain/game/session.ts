import { gameModeByName, type GameModeName } from "./modes";
import { isGridCellValid, pickDifferentCell, type GridCell } from "./grid";

export interface GameState {
  mode: GameModeName;
  isGameStarted: boolean;
  isGameOver: boolean;
  secondsLeft: number;
  activeCell: GridCell;
  correctClicks: number;
  incorrectClicks: number;
}

const createInitialActiveCell = (mode: GameModeName): GridCell => {
  const gridConfig = gameModeByName[mode];
  const mid = Math.floor(gridConfig.gridSize / 2);

  return {
    row: mid + 1,
    col: mid + 1,
  };
};

export const createGameState = (mode: GameModeName): GameState => {
  const gridConfig = gameModeByName[mode];
  return {
    mode,
    isGameStarted: false,
    isGameOver: false,
    secondsLeft: gridConfig.timeSeconds,
    activeCell: createInitialActiveCell(mode),
    correctClicks: 0,
    incorrectClicks: 0,
  };
};

export function createGridGameState(mode: GameModeName): GameState {
  return createGameState(mode);
}

export const tickSession = (state: GameState): GameState => {
  if (state.isGameOver || !state.isGameStarted) {
    return state;
  }

  const nextSecondsLeft = state.secondsLeft - 1;
  if (nextSecondsLeft > 0) {
    return { ...state, secondsLeft: nextSecondsLeft };
  }

  return {
    ...state,
    secondsLeft: 0,
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

  const gridConfig = gameModeByName[state.mode];
  return {
    ...state,
    activeCell: nextTarget(gridConfig.gridSize, state.activeCell),
  };
};

export const registerCellClick = (
  state: GameState,
  clickRow: number,
  clickCol: number,
  selectNextTarget: TargetSelector = (size, previous) => pickDifferentCell(size, previous)
): GameState => {
  if (state.isGameOver) {
    return state;
  }

  const startedState = state.isGameStarted ? state : { ...state, isGameStarted: true };
  const gridConfig = gameModeByName[state.mode];
  const clickCell = { row: clickRow, col: clickCol };

  if (!isGridCellValid(gridConfig.gridSize, clickCell)) {
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

export const resetSession = (state: GameState, nextMode?: GameModeName): GameState => {
  const mode = nextMode ?? state.mode;
  return createGridGameState(mode);
};

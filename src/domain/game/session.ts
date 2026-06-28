import { GameModeName, gameModeByName } from "./mode";

export interface GameState {
  mode: GameModeName;
  isGameStarted: boolean;
  isGameOver: boolean;
  secondsLeft: number;
  activeCell: { row: number; col: number };
  correctClicks: number;
  incorrectClicks: number;
}

export function createGridGameState(mode: GameModeName): GameState {
  return {
    mode,
    isGameStarted: false,
    isGameOver: false,
    secondsLeft: gameModeByName[mode].timeSeconds,
    activeCell: {
      row: 15,
      col: 15,
    },
    correctClicks: 0,
    incorrectClicks: 0,
  };
}

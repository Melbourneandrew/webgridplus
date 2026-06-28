export const gameModes = ["regular", "blitz"] as const;
export type GameModeName = (typeof gameModes)[number];

export const gameModeByName: Record<
  GameModeName,
  {
    timeSeconds: number;
    gridSize: number;
    gameTypeId: number;
  }
> = {
  regular: {
    timeSeconds: 60,
    gridSize: 30,
    gameTypeId: 1,
  },
  blitz: {
    timeSeconds: 15,
    gridSize: 30,
    gameTypeId: 2,
  },
};

export const defaultGridSize = 30;
export const regularModeGridSize = gameModeByName.regular.gridSize;

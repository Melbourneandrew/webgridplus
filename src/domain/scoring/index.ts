import {
  BITS_PER_SECOND_MIN,
  BITS_PER_TARGET_CONSTANT,
  DEFAULT_GAMEGRID_SIZE,
} from "./constants";

export interface ScoreInput {
  correctClicks: number;
  incorrectClicks: number;
  modeSeconds: number;
  gridSize?: number;
}

export interface ScoreOutput {
  ntpm: number;
  bps: number;
}

const assertPositiveModeSeconds = (modeSeconds: number) => {
  if (!Number.isFinite(modeSeconds) || modeSeconds <= 0) {
    throw new Error(`Invalid mode duration "${modeSeconds}"`);
  }
};

const assertFiniteIntegerClicks = (value: number, label: string) => {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid ${label} clicks "${value}"`);
  }
};

export function calculateNtpm(
  correctClicks: number,
  incorrectClicks: number,
  modeSeconds: number
): number {
  assertPositiveModeSeconds(modeSeconds);
  assertFiniteIntegerClicks(correctClicks, "correct");
  assertFiniteIntegerClicks(incorrectClicks, "incorrect");
  return (correctClicks - incorrectClicks) * (60 / modeSeconds);
}

export function calculateBps(ntpm: number, gridSize = DEFAULT_GAMEGRID_SIZE): number {
  if (!Number.isFinite(ntpm)) {
    throw new Error(`Invalid NTPM "${ntpm}"`);
  }
  if (!Number.isFinite(gridSize) || !Number.isInteger(gridSize) || gridSize <= 0) {
    throw new Error(`Invalid grid size "${gridSize}"`);
  }

  return Math.max(0, (ntpm * BITS_PER_TARGET_CONSTANT(gridSize)) / 60);
}

export function computeScore({
  correctClicks,
  incorrectClicks,
  modeSeconds,
  gridSize = DEFAULT_GAMEGRID_SIZE,
}: ScoreInput): ScoreOutput {
  const ntpm = calculateNtpm(correctClicks, incorrectClicks, modeSeconds);
  const bps = calculateBps(ntpm, gridSize);
  return { ntpm, bps };
}

export function ntpmAsRoundedDisplay(ntpm: number): number {
  if (!Number.isFinite(ntpm)) {
    return 0;
  }
  return Math.round(ntpm);
}

export const clampScoreToDisplayFloor = (value: number, floor = BITS_PER_SECOND_MIN): number =>
  Math.max(value, floor);

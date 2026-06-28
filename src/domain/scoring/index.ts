export const LOG2_900 = Math.log2(900);

export function calculateNtpm(
  correctClicks: number,
  incorrectClicks: number,
  modeSeconds: number
): number {
  return (correctClicks - incorrectClicks) * (60 / modeSeconds);
}

export function calculateBps(ntpm: number): number {
  return Math.max(0, (ntpm * LOG2_900) / 60);
}

export function computeScore(correctClicks: number, incorrectClicks: number, modeSeconds: number): { ntpm: number; bps: number } {
  const ntpm = calculateNtpm(correctClicks, incorrectClicks, modeSeconds);
  return {
    ntpm,
    bps: calculateBps(ntpm),
  };
}

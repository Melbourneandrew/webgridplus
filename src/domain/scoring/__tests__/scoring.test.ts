import { describe, expect, it } from "vitest";
import {
  calculateBps,
  calculateNtpm,
  clampScoreToDisplayFloor,
  computeScore,
  ntpmAsRoundedDisplay,
} from "..";
import { BITS_PER_TARGET_CONSTANT } from "../constants";

describe("scoring", () => {
  it("normalizes NTPM by regular mode duration", () => {
    expect(calculateNtpm(30, 4, 60)).toBe(26);
  });

  it("normalizes NTPM by blitz mode duration", () => {
    expect(calculateNtpm(30, 4, 15)).toBe(104);
  });

  it("rejects zero or negative mode duration", () => {
    expect(() => calculateNtpm(1, 0, 0)).toThrow("Invalid mode duration");
    expect(() => calculateNtpm(1, 0, -10)).toThrow("Invalid mode duration");
  });

  it("uses formula for NTPM", () => {
    expect(calculateNtpm(3, 8, 15)).toBe(-20);
  });

  it("uses Neuralink-supported log2(cellCount - 1) scaling", () => {
    const expected = (26 * BITS_PER_TARGET_CONSTANT(30)) / 60;
    expect(calculateBps(26, 30)).toBeCloseTo(expected, 10);
  });

  it("clamps negative BPS to zero", () => {
    expect(calculateBps(-4, 30)).toBe(0);
  });

  it("supports zero-click score fixture", () => {
    const result = computeScore({ correctClicks: 0, incorrectClicks: 0, modeSeconds: 60, gridSize: 30 });
    expect(result).toEqual({ ntpm: 0, bps: 0 });
  });

  it("supports all-miss score fixture", () => {
    const result = computeScore({ correctClicks: 1, incorrectClicks: 10, modeSeconds: 60, gridSize: 30 });
    expect(result.ntpm).toBe(-9);
    expect(result.bps).toBe(0);
  });

  it("handles large counts without overflow and preserves sign", () => {
    const result = computeScore({ correctClicks: 1_000_000, incorrectClicks: 999_999, modeSeconds: 60, gridSize: 30 });
    expect(result.ntpm).toBe(60 / 60);
    expect(result.bps).toBeGreaterThan(0);
  });

  it("matches computed-score contract", () => {
    const result = computeScore({ correctClicks: 30, incorrectClicks: 4, modeSeconds: 60, gridSize: 30 });
    const expected = {
      ntpm: 26,
      bps: (26 * Math.log2(30 * 30 - 1)) / 60,
    };
    expect(result).toEqual(expected);
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid click counts: %s",
    (clicks) => expect(() => calculateNtpm(clicks, 0, 60)).toThrow("Invalid correct clicks"),
  );

  it("rejects non-finite NTPM and invalid grid sizes", () => {
    expect(() => calculateBps(Number.NaN, 30)).toThrow("Invalid NTPM");
    expect(() => calculateBps(10, 0)).toThrow("Invalid grid size");
    expect(() => calculateBps(10, 2.5)).toThrow("Invalid grid size");
  });

  it("applies display rounding and floors defensively", () => {
    expect(ntpmAsRoundedDisplay(10.6)).toBe(11);
    expect(ntpmAsRoundedDisplay(Number.NaN)).toBe(0);
    expect(clampScoreToDisplayFloor(-1)).toBe(0);
    expect(clampScoreToDisplayFloor(4.5, 2)).toBe(4.5);
  });
});

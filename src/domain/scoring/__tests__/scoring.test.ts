import { describe, expect, it } from "vitest";
import { computeScore, calculateNtpm, calculateBps } from "../";

describe("scoring", () => {
  it("uses formula for NTPM", () => {
    expect(calculateNtpm(30, 4, 60)).toBe(26);
    expect(calculateNtpm(3, 8, 15)).toBe(-20);
  });

  it("clamps bps to zero", () => {
    expect(calculateBps(-4)).toBe(0);
  });

  it("matches computed score contract", () => {
    const result = computeScore(30, 4, 60);
    expect(result.ntpm).toBe(26);
    expect(result.bps).toBeGreaterThan(0);
  });
});

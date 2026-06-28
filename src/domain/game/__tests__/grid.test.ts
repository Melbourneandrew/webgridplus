import { describe, expect, it } from "vitest";
import {
  flattenCell,
  isGridCellValid,
  pickDifferentCell,
  unflattenCell,
} from "../grid";

describe("grid", () => {
  it("validates grid coordinates", () => {
    expect(isGridCellValid(30, { row: 1, col: 1 })).toBe(true);
    expect(isGridCellValid(30, { row: 0, col: 1 })).toBe(false);
    expect(isGridCellValid(30, { row: 31, col: 1 })).toBe(false);
    expect(isGridCellValid(30, { row: 1, col: 31 })).toBe(false);
  });

  it("maps cells to and from linear indexes deterministically", () => {
    const cell = { row: 10, col: 15 };
    const index = flattenCell(cell, 30);
    expect(index).toBe(429);
    expect(unflattenCell(index, 30)).toEqual(cell);
  });

  it("never returns the same cell on target move", () => {
    let cursor = 0;
    const sequence = [0.0, 0.5, 0.0, 0.5];
    const rng = () => sequence[cursor++] ?? 0.5;

    const selected = pickDifferentCell(30, { row: 1, col: 1 }, rng);
    expect(selected).toEqual({ row: 1, col: 16 });
  });
});

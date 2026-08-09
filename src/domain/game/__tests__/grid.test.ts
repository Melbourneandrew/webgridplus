import { describe, expect, it } from "vitest";
import {
  flattenCell,
  gridCellCount,
  isGridCellValid,
  pickDifferentCell,
  pickRandomCell,
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

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid grid size %s",
    (size) => expect(() => gridCellCount(size)).toThrow("Invalid grid size"),
  );

  it("round-trips every cell in a small grid", () => {
    for (let index = 0; index < gridCellCount(4); index += 1) {
      expect(flattenCell(unflattenCell(index, 4), 4)).toBe(index);
    }
  });

  it("maps RNG boundaries to the first and last cells", () => {
    expect(pickRandomCell(3, () => 0)).toEqual({ row: 1, col: 1 });
    expect(pickRandomCell(3, () => 0.999999)).toEqual({ row: 3, col: 3 });
  });

  it("uses the only cell for a one-by-one grid", () => {
    expect(pickDifferentCell(1, { row: 1, col: 1 }, () => 0)).toEqual({ row: 1, col: 1 });
  });

  it("rejects invalid flattened indexes and cells", () => {
    expect(() => unflattenCell(-1, 3)).toThrow("Invalid cell index");
    expect(() => unflattenCell(9, 3)).toThrow("Invalid cell index");
    expect(() => flattenCell({ row: 4, col: 1 }, 3)).toThrow("Invalid grid cell");
  });
});

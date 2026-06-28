import { describe, expect, it } from "vitest";
import { createGridGameState, registerCellClick, tickSession } from "../session";
import { BITS_PER_TARGET_CONSTANT } from "../../scoring/constants";
import { flattenCell, unflattenCell } from "../grid";

describe("game session", () => {
  it("initializes mode-specific timers", () => {
    expect(createGridGameState("regular").secondsLeft).toBe(60);
    expect(createGridGameState("blitz").secondsLeft).toBe(15);
  });

  it("starts game on first click", () => {
    const state = createGridGameState("regular");
    const next = registerCellClick(state, state.activeCell.row, state.activeCell.col);
    expect(next.isGameStarted).toBe(true);
  });

  it("counts correct clicks and updates active target", () => {
    const state = { ...createGridGameState("regular"), isGameStarted: true };
    const next = registerCellClick(
      state,
      state.activeCell.row,
      state.activeCell.col,
      () => ({ row: 2, col: 2 }),
    );

    expect(next.correctClicks).toBe(1);
    expect(next.activeCell).toEqual({ row: 2, col: 2 });
  });

  it("counts incorrect clicks without moving target", () => {
    const state = { ...createGridGameState("regular"), isGameStarted: true };
    const next = registerCellClick(state, 1, 2);

    expect(next.incorrectClicks).toBe(1);
    expect(next.correctClicks).toBe(0);
    expect(next.activeCell).toEqual(state.activeCell);
  });

  it("does not mutate clicks for out-of-bounds coordinates", () => {
    const state = { ...createGridGameState("regular"), isGameStarted: true };
    const next = registerCellClick(state, -1, -1);
    expect(next.incorrectClicks).toBe(1);
    expect(next.correctClicks).toBe(0);
  });

  it("moves target deterministically with injected picker", () => {
    const state = { ...createGridGameState("regular"), isGameStarted: true };
    const initialCell = state.activeCell;
    const deterministicNext = (size: number) => unflattenCell(1, size);
    const updated = registerCellClick(state, initialCell.row, initialCell.col, deterministicNext);
    expect(flattenCell(updated.activeCell, 30)).toBe(1);
  });

  it("advances timer and finishes at zero", () => {
    const state = { ...createGridGameState("regular"), isGameStarted: true };
    let working = state;
    for (let i = 0; i < 59; i += 1) {
      working = tickSession(working);
    }
    expect(working.isGameOver).toBe(false);
    expect(working.secondsLeft).toBe(1);

    const finalState = tickSession(working);
    expect(finalState.isGameOver).toBe(true);
    expect(finalState.secondsLeft).toBe(0);
    expect(finalState.isGameStarted).toBe(false);
  });

  it("documents bits-per-second constant for 30×30 grid", () => {
    expect(BITS_PER_TARGET_CONSTANT(30)).toBe(Math.log2(899));
  });
});

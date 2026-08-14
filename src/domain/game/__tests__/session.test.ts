import { describe, expect, it } from "vitest";
import {
  createGridGameState,
  registerCellClick,
  resetSession,
  resolveTargetMove,
  syncSessionClock,
} from "../session";
import { BITS_PER_TARGET_CONSTANT } from "../../scoring/constants";
import { flattenCell, unflattenCell } from "../grid";

describe("game session", () => {
  it("initializes mode-specific timers", () => {
    expect(createGridGameState("regular").secondsLeft).toBe(60);
    expect(createGridGameState("blitz").secondsLeft).toBe(15);
  });

  it("starts game on first click", () => {
    const state = createGridGameState("regular");
    const next = registerCellClick(state, state.activeCell.row, state.activeCell.col, undefined, 10_000);
    expect(next.isGameStarted).toBe(true);
    expect(next.endsAtMs).toBe(70_000);
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

  it("derives remaining time from the deadline and finishes at zero", () => {
    const state = {
      ...createGridGameState("regular"),
      isGameStarted: true,
      endsAtMs: 70_000,
    };
    const working = syncSessionClock(state, 68_001);
    expect(working.secondsLeft).toBe(2);
    expect(syncSessionClock(working, 69_001).secondsLeft).toBe(1);

    const finalState = syncSessionClock(working, 70_000);
    expect(finalState.isGameOver).toBe(true);
    expect(finalState.secondsLeft).toBe(0);
    expect(finalState.isGameStarted).toBe(false);
  });

  it("documents bits-per-second constant for 30×30 grid", () => {
    expect(BITS_PER_TARGET_CONSTANT(30)).toBe(Math.log2(899));
  });

  it("does not advance the clock before the first click", () => {
    const state = createGridGameState("regular");
    expect(syncSessionClock(state, 999_999)).toBe(state);
  });

  it("supports a compact grid as session configuration", () => {
    const state = createGridGameState("regular", 12);
    expect(state.gridSize).toBe(12);
    expect(state.activeCell).toEqual({ row: 7, col: 7 });
    const next = registerCellClick(state, 7, 7, () => ({ row: 12, col: 12 }), 0);
    expect(next.activeCell).toEqual({ row: 12, col: 12 });
  });

  it("ignores clicks and target moves after game over", () => {
    const state = { ...createGridGameState("blitz"), isGameOver: true };
    expect(registerCellClick(state, 15, 15)).toBe(state);
    expect(resolveTargetMove(state, () => ({ row: 1, col: 1 }))).toBe(state);
  });

  it("resets all transient state and can switch modes", () => {
    const state = {
      ...createGridGameState("regular"),
      isGameStarted: true,
      isGameOver: true,
      correctClicks: 12,
      incorrectClicks: 3,
      secondsLeft: 0,
    };

    expect(resetSession(state, "blitz")).toEqual(createGridGameState("blitz"));
  });
});

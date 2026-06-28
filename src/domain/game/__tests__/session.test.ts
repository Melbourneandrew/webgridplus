import { describe, expect, it } from "vitest";
import { createGridGameState } from "../session";

describe("game session", () => {
  it("initializes mode-specific timers", () => {
    expect(createGridGameState("regular").secondsLeft).toBe(60);
    expect(createGridGameState("blitz").secondsLeft).toBe(15);
  });
});

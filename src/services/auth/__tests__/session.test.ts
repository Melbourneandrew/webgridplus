import { describe, expect, it } from "vitest";
import { ACCESS_TTL_SECONDS, hashAuthToken, REFRESH_TTL_SECONDS } from "../tokens";
import { normalizeEmail } from "../identity";

describe("auth session helpers", () => {
  it("normalizes email identity consistently", () => {
    expect(normalizeEmail("  Player@Example.COM ")).toBe("player@example.com");
  });

  it("uses distinct, intentionally short access and long refresh lifetimes", () => {
    expect(ACCESS_TTL_SECONDS).toBe(15 * 60);
    expect(REFRESH_TTL_SECONDS).toBe(30 * 24 * 60 * 60);
  });

  it("stores only deterministic token hashes", () => {
    expect(hashAuthToken("secret-token")).toMatch(/^[a-f0-9]{64}$/);
    expect(hashAuthToken("secret-token")).not.toContain("secret-token");
  });
});

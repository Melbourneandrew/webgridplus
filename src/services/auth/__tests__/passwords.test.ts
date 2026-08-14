// @vitest-environment node
import { describe, expect, it } from "vitest";
import { hashPassword, verifyPasswordHash } from "../passwords";

describe("password hashing", () => {
  it("uses salted Argon2id hashes and verifies without storing plaintext", async () => {
    const first = await hashPassword("correct-horse-battery-staple");
    const second = await hashPassword("correct-horse-battery-staple");
    expect(first).toMatch(/^\$argon2id\$v=19\$m=19456,t=2,p=1\$/);
    expect(first).not.toBe(second);
    await expect(verifyPasswordHash(first, "correct-horse-battery-staple")).resolves.toBe(true);
    await expect(verifyPasswordHash(first, "wrong-password")).resolves.toBe(false);
  });
});

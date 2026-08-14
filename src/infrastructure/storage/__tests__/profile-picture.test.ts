// @vitest-environment node
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  sanitizeProfilePictureFileName,
  saveProfilePicture,
} from "../profile-picture";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      fs.rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe("profile picture storage", () => {
  it("removes path traversal from client-provided names", () => {
    expect(sanitizeProfilePictureFileName("../../avatar.png")).toBe("avatar.png");
    expect(sanitizeProfilePictureFileName("..\\..\\avatar.png")).toBe("..-..-avatar.png");
  });

  it("normalizes unsafe filename characters", () => {
    expect(sanitizeProfilePictureFileName("my profile (final).png")).toBe(
      "my-profile--final-.png",
    );
    expect(sanitizeProfilePictureFileName("///")).toBe("upload");
  });

  it("writes bytes below the public profile-pictures directory", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "webgridplus-picture-"));
    temporaryDirectories.push(root);
    vi.spyOn(process, "cwd").mockReturnValue(root);

    const bytes = Buffer.from("image bytes");
    const url = await saveProfilePicture("avatar.png", bytes);

    expect(url).toMatch(/^\/profile-pictures\/[0-9a-f-]+-avatar\.png$/);
    expect(await fs.readFile(path.join(root, "public", url))).toEqual(bytes);
  });

  it("cannot write outside the public profile-pictures directory", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "webgridplus-picture-"));
    temporaryDirectories.push(root);
    vi.spyOn(process, "cwd").mockReturnValue(root);

    const url = await saveProfilePicture("../../outside.png", Buffer.from("safe"));

    expect(url).toContain("/profile-pictures/");
    await expect(fs.stat(path.join(root, "outside.png"))).rejects.toMatchObject({
      code: "ENOENT",
    });
  });
});

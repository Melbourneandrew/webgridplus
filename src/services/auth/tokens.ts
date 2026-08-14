import { createHash } from "crypto";

export const ACCESS_COOKIE_NAME = "wgp_access";
export const REFRESH_COOKIE_NAME = "wgp_refresh";
export const ACCESS_TTL_SECONDS = 15 * 60;
export const REFRESH_TTL_SECONDS = 30 * 24 * 60 * 60;

export function hashAuthToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

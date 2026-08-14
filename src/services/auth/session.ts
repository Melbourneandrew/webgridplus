import { randomBytes, randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createSession,
  createUser,
  destroySessionByTokenHash,
  getAccessSessionUser,
  getUserByEmail,
  rotateSession,
  verifyPassword,
} from "@/infrastructure/db/repositories/user-repository";
import { normalizeEmail } from "./identity";
export {
  ACCESS_COOKIE_NAME,
  ACCESS_TTL_SECONDS,
  hashAuthToken,
  REFRESH_COOKIE_NAME,
  REFRESH_TTL_SECONDS,
} from "./tokens";
import {
  ACCESS_COOKIE_NAME,
  ACCESS_TTL_SECONDS,
  hashAuthToken,
  REFRESH_COOKIE_NAME,
  REFRESH_TTL_SECONDS,
} from "./tokens";

export type AuthenticatedUser = {
  id: string;
  displayName: string;
  email: string;
};

type TokenPair = {
  accessToken: string;
  accessExpiresAt: Date;
  refreshToken: string;
  refreshExpiresAt: Date;
};

function newToken() {
  return randomBytes(32).toString("base64url");
}

function expiresIn(seconds: number) {
  return new Date(Date.now() + seconds * 1000);
}

function issueTokenPair(): TokenPair {
  return {
    accessToken: newToken(),
    accessExpiresAt: expiresIn(ACCESS_TTL_SECONDS),
    refreshToken: newToken(),
    refreshExpiresAt: expiresIn(REFRESH_TTL_SECONDS),
  };
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  priority: "high" as const,
};

export function setAuthCookies(response: NextResponse, tokens: TokenPair) {
  response.cookies.set(ACCESS_COOKIE_NAME, tokens.accessToken, {
    ...cookieOptions,
    expires: tokens.accessExpiresAt,
  });
  response.cookies.set(REFRESH_COOKIE_NAME, tokens.refreshToken, {
    ...cookieOptions,
    expires: tokens.refreshExpiresAt,
  });
}

export function deleteAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 });
}

async function createAuthSession(userId: string) {
  const tokens = issueTokenPair();
  await createSession({
    id: randomUUID(),
    userId,
    accessTokenHash: hashAuthToken(tokens.accessToken),
    accessExpiresAt: tokens.accessExpiresAt,
    refreshTokenHash: hashAuthToken(tokens.refreshToken),
    refreshExpiresAt: tokens.refreshExpiresAt,
  });
  return tokens;
}

export async function refreshAuthSession(refreshToken: string) {
  const tokens = issueTokenPair();
  const user = await rotateSession(hashAuthToken(refreshToken), {
    accessTokenHash: hashAuthToken(tokens.accessToken),
    accessExpiresAt: tokens.accessExpiresAt,
    refreshTokenHash: hashAuthToken(tokens.refreshToken),
  });
  return user ? { user: toAuthenticatedUser(user), tokens } : null;
}

export async function revokeAuthSession(accessToken?: string, refreshToken?: string) {
  if (refreshToken) await destroySessionByTokenHash(hashAuthToken(refreshToken));
  else if (accessToken) await destroySessionByTokenHash(hashAuthToken(accessToken));
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const accessToken = cookies().get(ACCESS_COOKIE_NAME)?.value;
  if (!accessToken) return null;
  const user = await getAccessSessionUser(hashAuthToken(accessToken));
  return user ? toAuthenticatedUser(user) : null;
}

function toAuthenticatedUser(user: { id: string; displayName: string; email: string }) {
  return { id: user.id, displayName: user.displayName, email: user.email };
}

export async function signup(input: { displayName: string; email: string; password: string }) {
  const email = normalizeEmail(input.email);
  if (await getUserByEmail(email)) return { ok: false as const, error: "Email already exists" };
  const created = await createUser({ ...input, email });
  if (!created) return { ok: false as const, error: "Unable to create user" };
  return { ok: true as const, user: toAuthenticatedUser(created), tokens: await createAuthSession(created.id) };
}

export async function login(input: { email: string; password: string }) {
  const user = await verifyPassword(normalizeEmail(input.email), input.password);
  if (!user) return { ok: false as const, error: "Invalid email/password" };
  return { ok: true as const, user: toAuthenticatedUser(user), tokens: await createAuthSession(user.id) };
}

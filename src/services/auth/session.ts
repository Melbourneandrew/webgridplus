import { randomBytes, randomUUID } from "crypto";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createSession,
  createUser,
  destroySessionByTokenHash,
  getRefreshSessionUser,
  getUserByEmail,
  rotateSession,
  verifyPassword,
} from "@/infrastructure/db/repositories/user-repository";
import { ENV } from "@/lib/env";
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

const JWT_ISSUER = "webgridplus";
const JWT_AUDIENCE = "webgridplus";
const jwtSecret = new TextEncoder().encode(ENV.SESSION_SECRET);

async function issueAccessToken(user: AuthenticatedUser) {
  return new SignJWT({ email: user.email, displayName: user.displayName })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(user.id)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SECONDS}s`)
    .sign(jwtSecret);
}

async function issueTokenPair(user: AuthenticatedUser): Promise<TokenPair> {
  return {
    accessToken: await issueAccessToken(user),
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

async function createAuthSession(user: AuthenticatedUser) {
  const tokens = await issueTokenPair(user);
  await createSession({
    id: randomUUID(),
    userId: user.id,
    accessTokenHash: hashAuthToken(tokens.accessToken),
    accessExpiresAt: tokens.accessExpiresAt,
    refreshTokenHash: hashAuthToken(tokens.refreshToken),
    refreshExpiresAt: tokens.refreshExpiresAt,
  });
  return tokens;
}

export async function refreshAuthSession(refreshToken: string) {
  const refreshTokenHash = hashAuthToken(refreshToken);
  const storedUser = await getRefreshSessionUser(refreshTokenHash);
  if (!storedUser) return null;
  const authenticatedUser = toAuthenticatedUser(storedUser);
  const tokens = await issueTokenPair(authenticatedUser);
  const user = await rotateSession(refreshTokenHash, {
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
  try {
    const { payload } = await jwtVerify(accessToken, jwtSecret, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      typeof payload.displayName !== "string"
    ) return null;
    return { id: payload.sub, email: payload.email, displayName: payload.displayName };
  } catch {
    return null;
  }
}

function toAuthenticatedUser(user: { id: string; displayName: string; email: string }) {
  return { id: user.id, displayName: user.displayName, email: user.email };
}

export async function signup(input: { displayName: string; email: string; password: string }) {
  const email = normalizeEmail(input.email);
  if (await getUserByEmail(email)) return { ok: false as const, error: "Email already exists" };
  const created = await createUser({ ...input, email });
  if (!created) return { ok: false as const, error: "Unable to create user" };
  const user = toAuthenticatedUser(created);
  return { ok: true as const, user, tokens: await createAuthSession(user) };
}

export async function login(input: { email: string; password: string }) {
  const user = await verifyPassword(normalizeEmail(input.email), input.password);
  if (!user) return { ok: false as const, error: "Invalid email/password" };
  const authenticatedUser = toAuthenticatedUser(user);
  return { ok: true as const, user: authenticatedUser, tokens: await createAuthSession(authenticatedUser) };
}

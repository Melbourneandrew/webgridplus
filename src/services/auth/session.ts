import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import {
  createSession,
  createUser,
  destroySession,
  getSessionUser,
  getUserByEmail,
  verifyPassword,
} from "@/infrastructure/db/repositories/user-repository";

export const SESSION_COOKIE_NAME = "wgp_session";
const SESSION_TTL_DAYS = 14;

export type AuthenticatedUser = {
  id: string;
  displayName: string;
  email: string;
};

function cookieStore() {
  return cookies();
}

export async function createAuthSession(userId: string) {
  const sessionId = randomUUID();
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + SESSION_TTL_DAYS);
  await createSession(userId, sessionId, expiry);
  const cookie = cookieStore();
  cookie.set({
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiry,
  });
}

export async function clearSessionCookie() {
  const cookie = cookieStore();
  const sessionId = cookie.get(SESSION_COOKIE_NAME)?.value;
  if (sessionId) {
    await destroySession(sessionId);
  }
  cookie.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const sessionId = cookieStore().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const user = await getSessionUser(sessionId);
  return user
    ? {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
      }
    : null;
}

export async function signup(input: {
  displayName: string;
  email: string;
  password: string;
}): Promise<{ ok: boolean; error?: string; user?: AuthenticatedUser }> {
  const existing = await getUserByEmail(input.email);
  if (existing) {
    return { ok: false, error: "Email already exists" };
  }

  const created = await createUser(input);
  if (!created) {
    return { ok: false, error: "Unable to create user" };
  }

  await createAuthSession(created.id);
  return {
    ok: true,
    user: {
      id: created.id,
      displayName: created.displayName,
      email: created.email,
    },
  };
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<{ ok: boolean; error?: string; user?: AuthenticatedUser }> {
  const user = await verifyPassword(input.email, input.password);
  if (!user) {
    return { ok: false, error: "Invalid email/password" };
  }

  await createAuthSession(user.id);
  return {
    ok: true,
    user: {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
    },
  };
}

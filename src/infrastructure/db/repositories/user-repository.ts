import { randomUUID } from "crypto";
import { eq, or } from "drizzle-orm";
import { hashPassword, verifyPasswordHash } from "@/services/auth/passwords";
import { db } from "../client";
import { profiles, sessions, users } from "../schema";

export async function getUserByEmail(email: string) {
  return await db.select().from(users).where(eq(users.email, email)).get();
}

export async function getUserById(id: string) {
  return await db.select().from(users).where(eq(users.id, id)).get();
}

export async function createUser(params: {
  displayName: string;
  email: string;
  password: string;
}) {
  const hashed = await hashPassword(params.password);
  const id = randomUUID();

  try {
    db.transaction((tx) => {
      tx.insert(users).values({
        id,
        displayName: params.displayName,
        email: params.email,
        passwordHash: hashed,
        createdAt: new Date(),
      }).run();
      tx.insert(profiles).values({
        id,
        displayName: params.displayName,
        createdAt: new Date(),
      }).run();
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      return null;
    }
    throw error;
  }

  return getUserById(id);
}

export async function verifyPassword(email: string, password: string) {
  const found = await getUserByEmail(email);
  if (!found) return null;
  const valid = await verifyPasswordHash(found.passwordHash, password);
  if (!valid) return null;
  return found;
}

export async function createSession(params: {
  id: string;
  userId: string;
  accessTokenHash: string;
  accessExpiresAt: Date;
  refreshTokenHash: string;
  refreshExpiresAt: Date;
}) {
  db.insert(sessions)
    .values({
      ...params,
      createdAt: new Date(),
      rotatedAt: new Date(),
    })
    .run();
}

export async function getAccessSessionUser(accessTokenHash: string) {
  const session = await db.select().from(sessions).where(eq(sessions.accessTokenHash, accessTokenHash)).get();
  if (!session || session.accessExpiresAt <= new Date() || session.refreshExpiresAt <= new Date()) {
    return null;
  }
  return getUserById(session.userId);
}

export async function getRefreshSessionUser(refreshTokenHash: string) {
  const session = db.select().from(sessions).where(eq(sessions.refreshTokenHash, refreshTokenHash)).get();
  if (!session || session.refreshExpiresAt <= new Date()) return null;
  return getUserById(session.userId);
}

export async function rotateSession(
  refreshTokenHash: string,
  tokens: { accessTokenHash: string; accessExpiresAt: Date; refreshTokenHash: string }
) {
  const userId = db.transaction((tx) => {
    const session = tx.select().from(sessions).where(eq(sessions.refreshTokenHash, refreshTokenHash)).get();
    if (!session || session.refreshExpiresAt <= new Date()) return null;
    tx.update(sessions)
      .set({ ...tokens, rotatedAt: new Date() })
      .where(eq(sessions.id, session.id))
      .run();
    return session.userId;
  });
  return userId ? getUserById(userId) : null;
}

export async function destroySessionByTokenHash(tokenHash: string) {
  db.delete(sessions)
    .where(or(eq(sessions.accessTokenHash, tokenHash), eq(sessions.refreshTokenHash, tokenHash)))
    .run();
}

export async function getProfile(userId: string) {
  return db.select().from(profiles).where(eq(profiles.id, userId)).get();
}

export async function upsertProfilePicture(userId: string, profilePicture: string) {
  db
    .update(profiles)
    .set({ profilePicture })
    .where(eq(profiles.id, userId))
    .run();
}

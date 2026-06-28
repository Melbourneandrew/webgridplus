import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { and, eq, gt } from "drizzle-orm";
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
  const hashed = await bcrypt.hash(params.password, 10);
  const id = randomUUID();

  db.transaction((tx) => {
    tx.insert(users).values({
      id,
      displayName: params.displayName,
      email: params.email,
      passwordHash: hashed,
      createdAt: new Date(),
    });
    tx.insert(profiles).values({
      id,
      displayName: params.displayName,
      createdAt: new Date(),
    });
  });

  return getUserById(id);
}

export async function verifyPassword(email: string, password: string) {
  const found = await getUserByEmail(email);
  if (!found) return null;
  const valid = await bcrypt.compare(password, found.passwordHash);
  if (!valid) return null;
  return found;
}

export async function createSession(userId: string, sessionId: string, expiresAt: Date) {
  await db
    .delete(sessions)
    .where(and(eq(sessions.userId, userId), gt(sessions.expiresAt, new Date(0))));
  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
    createdAt: new Date(),
  });
}

export async function getSessionUser(sessionId: string) {
  const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).get();
  if (!session || session.expiresAt < new Date()) {
    return null;
  }
  return getUserById(session.userId);
}

export async function destroySession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function getProfile(userId: string) {
  return db.select().from(profiles).where(eq(profiles.id, userId)).get();
}

export async function upsertProfilePicture(userId: string, profilePicture: string) {
  await db
    .update(profiles)
    .set({ profilePicture })
    .where(eq(profiles.id, userId));
}

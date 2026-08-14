import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "./client";
import { gameTypes, profiles, users } from "./schema";
import { count } from "drizzle-orm";

async function main() {
  await db
    .insert(gameTypes)
    .values([
      { typeName: "regular", durationSeconds: 60, gridCellCount: 900, createdAt: new Date() },
      { typeName: "blitz", durationSeconds: 15, gridCellCount: 900, createdAt: new Date() },
    ])
    .onConflictDoNothing();

  const existingUsers = await db.select({ count: count() }).from(users);
  if (!existingUsers[0]?.count) {
    const id = randomUUID();
    await db.insert(users).values({
      id,
      displayName: "Webgrid Demo",
      email: "demo@webgrid.test",
      passwordHash: await bcrypt.hash("changeme", 10),
      createdAt: new Date(),
    });
    await db.insert(profiles).values({
      id,
      displayName: "Webgrid Demo",
      profilePicture: null,
      createdAt: new Date(),
    });
  }

  process.stdout.write("Seed completed\n");
}

void main();

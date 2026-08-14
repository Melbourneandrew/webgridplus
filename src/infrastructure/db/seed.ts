import { randomUUID } from "crypto";
import { hashPassword } from "@/services/auth/passwords";
import { db } from "./client";
import { gameTypes, profiles, users } from "./schema";
import { count } from "drizzle-orm";

async function main() {
  db
    .insert(gameTypes)
    .values([
      { typeName: "regular", durationSeconds: 60, gridCellCount: 900, createdAt: new Date() },
      { typeName: "blitz", durationSeconds: 15, gridCellCount: 900, createdAt: new Date() },
    ])
    .onConflictDoNothing()
    .run();

  const existingUsers = db.select({ count: count() }).from(users).get();
  if (!existingUsers?.count) {
    const id = randomUUID();
    db.insert(users).values({
      id,
      displayName: "Webgrid Demo",
      email: "demo@webgrid.test",
      passwordHash: await hashPassword("changeme"),
      createdAt: new Date(),
    }).run();
    db.insert(profiles).values({
      id,
      displayName: "Webgrid Demo",
      profilePicture: null,
      createdAt: new Date(),
    }).run();
  }

  process.stdout.write("Seed completed\n");
}

void main();

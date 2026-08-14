import { and, avg, count, desc, eq, sql } from "drizzle-orm";
import { db } from "../client";
import { gameTypes, playedGames, profileStats, profiles } from "../schema";

const toNumber = (value: unknown) => Number(value as string | number | null);

export async function getGameTypeIdByName(typeName: string) {
  const row = await db
    .select({ id: gameTypes.id })
    .from(gameTypes)
    .where(eq(gameTypes.typeName, typeName))
    .get();
  return row?.id ?? null;
}

export async function getRankForPlayedGame(playedGameId: number, gameTypeId: number) {
  const row = db
    .select({
      rank: sql<number>`1 + (
        SELECT COUNT(*)
        FROM played_games pg2
        WHERE pg2.game_type_id = ${gameTypeId}
          AND pg2.bps > (SELECT bps FROM played_games pg3 WHERE pg3.id = ${playedGameId})
      )`,
    })
    .from(playedGames)
    .where(eq(playedGames.id, playedGameId))
    .get();

  const raw = row?.rank;
  return raw == null ? null : toNumber(raw);
}

export async function addPlayedGame(userId: string, gameTypeId: number, bps: number) {
  const row = db
    .insert(playedGames)
    .values({ userId, gameTypeId, bps, playedAt: new Date() })
    .returning({ id: playedGames.id, userId: playedGames.userId, gameTypeId: playedGames.gameTypeId })
    .get();

  if (!row) return null;
  await refreshProfileStats(userId, gameTypeId);
  return row;
}

export async function getLeaderboardRows(gameTypeId: number, limit = 100) {
  const rows = db
    .select({
      id: playedGames.id,
      userId: playedGames.userId,
      bps: playedGames.bps,
      playedAt: playedGames.playedAt,
      displayName: profiles.displayName,
      profilePicture: profiles.profilePicture,
    })
    .from(playedGames)
    .innerJoin(profiles, eq(playedGames.userId, profiles.id))
    .where(eq(playedGames.gameTypeId, gameTypeId))
    .orderBy(desc(playedGames.bps), desc(playedGames.playedAt))
    .limit(limit)
    .all();

  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

export async function getProfileStatsRow(userId: string, gameTypeId: number) {
  const aggregateRow = db
    .select({
      highestScore: sql<number>`MAX(${playedGames.bps})`,
      averageScore: avg(playedGames.bps),
      totalGamesPlayed: count(playedGames.id),
    })
    .from(playedGames)
    .where(and(eq(playedGames.userId, userId), eq(playedGames.gameTypeId, gameTypeId)))
    .get();

  if (!aggregateRow?.totalGamesPlayed) {
    return null;
  }

  const rankRows = db
    .select({
      userId: playedGames.userId,
      bestScore: sql<number>`MAX(${playedGames.bps})`,
    })
    .from(playedGames)
    .where(eq(playedGames.gameTypeId, gameTypeId))
    .groupBy(playedGames.userId)
    .all();

  const targetScore = toNumber(aggregateRow.highestScore);
  const sorted = rankRows.toSorted(
    (a, b) => toNumber(b.bestScore) - toNumber(a.bestScore)
  );
  const rank = sorted.findIndex((row) => row.userId === userId && toNumber(row.bestScore) === targetScore) + 1;

  return {
    rank: rank > 0 ? rank : null,
    highestScore: toNumber(aggregateRow.highestScore),
    averageScore: toNumber(aggregateRow.averageScore),
    totalGamesPlayed: toNumber(aggregateRow.totalGamesPlayed),
  };
}

export async function refreshProfileStats(userId: string, gameTypeId: number) {
  const raw = await getProfileStatsRow(userId, gameTypeId);
  if (!raw) {
    return;
  }

  db
    .insert(profileStats)
    .values({
      profileId: userId,
      gameTypeId,
      rank: raw.rank,
      highestScore: raw.highestScore,
      averageScore: raw.averageScore,
      totalGamesPlayed: raw.totalGamesPlayed,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [profileStats.profileId, profileStats.gameTypeId],
      set: {
        rank: raw.rank,
        highestScore: raw.highestScore,
        averageScore: raw.averageScore,
        totalGamesPlayed: raw.totalGamesPlayed,
        updatedAt: new Date(),
      },
    })
    .run();
}

export async function getProfileStatsFromMaterialized(userId: string, gameTypeId: number) {
  const row = await db
    .select()
    .from(profileStats)
    .where(and(eq(profileStats.profileId, userId), eq(profileStats.gameTypeId, gameTypeId)))
    .get();

  if (!row) return null;

  return {
    ...row,
    rank: row.rank == null ? null : toNumber(row.rank),
    highestScore: row.highestScore == null ? null : toNumber(row.highestScore),
    averageScore: row.averageScore == null ? null : toNumber(row.averageScore),
    totalGamesPlayed: toNumber(row.totalGamesPlayed),
  };
}

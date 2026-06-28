import { gameModeByName, type GameModeName } from "@/domain/game/mode";
import { getLeaderboardRows } from "@/infrastructure/db/repositories/game-repository";

export type LeaderboardRow = {
  id: number;
  userId: string;
  displayName: string;
  profilePicture: string | null;
  bps: number;
  playedAt: Date;
  rank: number;
};

export async function getLeaderboardPage(mode: GameModeName): Promise<LeaderboardRow[]> {
  const gameTypeId = gameModeByName[mode].gameTypeId;
  const rows = await getLeaderboardRows(gameTypeId, 100);
  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    displayName: row.displayName,
    profilePicture: row.profilePicture,
    bps: row.bps,
    playedAt: row.playedAt,
    rank: row.rank,
  }));
}

"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/services/auth/session";
import {
  getGameTypeIdByName,
  addPlayedGame,
  getRankForPlayedGame,
  getProfileStatsFromMaterialized,
} from "@/infrastructure/db/repositories/game-repository";
import { gameModeByName, type GameModeName } from "@/domain/game/mode";

type SubmitPlayedGameInput = {
  gameType: GameModeName;
  bps: number;
  ntpm: number;
};

export type SubmitPlayedGameResponse = {
  playedGameId?: number;
  rank?: number | null;
  average?: number | null;
};

export async function submitPlayedGame(input: SubmitPlayedGameInput): Promise<SubmitPlayedGameResponse | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const gameTypeId = gameModeByName[input.gameType].gameTypeId;
  const matched = await getGameTypeIdByName(input.gameType);
  if (!matched) return null;

  const playedGame = await addPlayedGame(user.id, matched, input.bps);
  if (!playedGame) return null;

  const rank = await getRankForPlayedGame(playedGame.id, gameTypeId);
  const profileStats = await getProfileStatsFromMaterialized(user.id, gameTypeId);

  revalidatePath("/leaderboard");
  revalidatePath("/profile");

  return {
    playedGameId: playedGame.id,
    rank: rank ?? null,
    average: profileStats?.averageScore ?? null,
  };
}

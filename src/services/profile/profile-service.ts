import { gameModeByName } from "@/domain/game/modes";
import { getProfile } from "@/infrastructure/db/repositories/user-repository";
import {
  getProfileStatsFromMaterialized,
  getProfileStatsRow,
} from "@/infrastructure/db/repositories/game-repository";

const toNumber = (value: unknown): number =>
  value == null ? 0 : Number(value as string | number);

export type ProfileModeStats = {
  rank: number | null;
  highestScore: number | null;
  averageScore: number | null;
  totalGamesPlayed: number;
};

export type ProfilePageModel = {
  userId: string;
  displayName: string;
  profilePicture: string | null;
  regular: ProfileModeStats;
  blitz: ProfileModeStats;
};

export async function getProfileByUserId(userId: string): Promise<ProfilePageModel | null> {
  const profile = await getProfile(userId);
  if (!profile) return null;

  const regular = await loadModeStats(userId, gameModeByName.regular.gameTypeId);
  const blitz = await loadModeStats(userId, gameModeByName.blitz.gameTypeId);

  return {
    userId: profile.id,
    displayName: profile.displayName,
    profilePicture: profile.profilePicture ?? null,
    regular,
    blitz,
  };
}

async function loadModeStats(userId: string, gameTypeId: number): Promise<ProfileModeStats> {
  const materialized = await getProfileStatsFromMaterialized(userId, gameTypeId);
  if (materialized) {
    return {
      rank: materialized.rank == null ? null : toNumber(materialized.rank),
      highestScore: materialized.highestScore ?? null,
      averageScore: materialized.averageScore ?? null,
      totalGamesPlayed: materialized.totalGamesPlayed ?? 0,
    };
  }

  const fresh = await getProfileStatsRow(userId, gameTypeId);
  return {
    rank: fresh?.rank ?? null,
    highestScore: fresh?.highestScore ?? null,
    averageScore: fresh?.averageScore ?? null,
    totalGamesPlayed: fresh?.totalGamesPlayed ?? 0,
  };
}

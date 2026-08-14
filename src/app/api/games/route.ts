import { NextResponse } from "next/server";
import { submitPlayedGame } from "@/services/game/game-service";
import { z } from "zod";

const playedGameSchema = z.object({
  gameType: z.enum(["regular", "blitz"]),
  ntpm: z.number().finite().nonnegative().max(100_000),
  bps: z.number().finite().nonnegative().max(10_000),
});

export async function POST(request: Request) {
  const parsed = playedGameSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid game result" }, { status: 400 });
  }
  const result = await submitPlayedGame(parsed.data);

  if (!result) {
    return NextResponse.json({ error: "Unable to save game" }, { status: 401 });
  }

  return NextResponse.json(result);
}

import { NextResponse } from "next/server";
import { submitPlayedGame } from "@/services/game/game-service";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await submitPlayedGame(body);

  if (!result) {
    return NextResponse.json({ error: "Unable to save game" }, { status: 401 });
  }

  return NextResponse.json(result);
}

import type { Metadata } from "next";
import { gameModes, parseGameMode } from "@/domain/game/modes";
import { GameShell } from "@/features/game/components/game-shell";

interface GamePageProps {
  searchParams?: {
    mode?: string | string[];
  };
}

export const metadata: Metadata = {
  title: "Play",
};

export default function GamePage({ searchParams }: GamePageProps) {
  return <GameShell defaultMode={parseGameMode(searchParams?.mode)} availableModes={gameModes} />;
}

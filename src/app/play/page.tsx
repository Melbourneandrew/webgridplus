import type { Metadata } from "next";
import { gameModes, parseGameMode } from "@/domain/game/modes";
import { GameShell } from "@/features/game/components/game-shell";

interface PlayPageProps {
  searchParams?: {
    mode?: string | string[];
  };
}

export const metadata: Metadata = {
  title: "Play",
};

export default function PlayPage({ searchParams }: PlayPageProps) {
  return <GameShell defaultMode={parseGameMode(searchParams?.mode)} availableModes={gameModes} />;
}

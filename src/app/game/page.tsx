import { gameModes, type GameModeName } from "@/domain/game/modes";
import { GameShell } from "@/features/game/components/game-shell";

interface GamePageProps {
  searchParams?: {
    mode?: string;
  };
}

export default function GamePage({ searchParams }: GamePageProps) {
  const mode = searchParams?.mode === "blitz" ? "blitz" : "regular";
  return <GameShell defaultMode={mode} availableModes={gameModes} />;
}

import { gameModes, type GameModeName } from "@/domain/game/mode";
import { GameShell } from "@/features/game/components/game-shell";

interface GamePageProps {
  searchParams?: {
    mode?: string;
  };
}

export default function GamePage({ searchParams }: GamePageProps) {
  const mode = searchParams?.mode === "blitz" ? "blitz" : "regular";
  const defaultMode = mode as GameModeName;
  return <GameShell defaultMode={defaultMode} availableModes={gameModes as unknown as GameModeName[]} />;
}

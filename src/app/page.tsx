import { gameModes, parseGameMode } from "@/domain/game/modes";
import { GameShell } from "@/features/game/components/game-shell";

interface HomePageProps {
  searchParams?: {
    mode?: string | string[];
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  return <GameShell defaultMode={parseGameMode(searchParams?.mode)} availableModes={gameModes} />;
}

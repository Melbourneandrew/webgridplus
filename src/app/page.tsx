import { gameModes, type GameModeName } from "@/domain/game/modes";
import { GameShell } from "@/features/game/components/game-shell";

export default async function HomePage() {
  const defaultMode: GameModeName = "regular";
  return <GameShell defaultMode={defaultMode} availableModes={gameModes as unknown as GameModeName[]} />;
}

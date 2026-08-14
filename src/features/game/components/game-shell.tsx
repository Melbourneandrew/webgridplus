import { type GameModeName } from "@/domain/game/modes";
import { GameClient } from "./game-client";

interface GameShellProps {
  defaultMode: GameModeName;
  availableModes: readonly GameModeName[];
}

export function GameShell({ defaultMode, availableModes }: GameShellProps) {
  return (
    <section className="mx-auto max-w-6xl">
      <GameClient defaultMode={defaultMode} availableModes={availableModes} />
    </section>
  );
}

import { type GameModeName } from "@/domain/game/modes";
import { GameClient } from "./game-client";

interface GameShellProps {
  defaultMode: GameModeName;
  availableModes: readonly GameModeName[];
}

export function GameShell({ defaultMode, availableModes }: GameShellProps) {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-6 text-center lg:text-left">
        <h1 className="text-4xl font-bold">Play Webgrid+</h1>
        <p className="mt-1 text-sm text-gray-500">Click the blue square to begin. Misclicks are penalized.</p>
      </div>
      <GameClient defaultMode={defaultMode} availableModes={availableModes} />
    </section>
  );
}

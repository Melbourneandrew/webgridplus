import Link from "next/link";
import { type GameModeName } from "@/domain/game/modes";
import { GameClient } from "./game-client";

interface GameShellProps {
  defaultMode: GameModeName;
  availableModes: readonly GameModeName[];
}

export function GameShell({ defaultMode, availableModes }: GameShellProps) {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold">Play Webgrid+</h1>
        <p className="mt-1 text-sm text-gray-500">Click the blue square to begin. Misclicks are penalized.</p>
        <div className="mt-3 flex justify-center gap-2">
          {availableModes.map((mode) => (
            <Link
              key={mode}
              href={mode === "regular" ? "/game" : `/game?mode=${mode}`}
              className={`rounded border px-3 py-1 ${defaultMode === mode ? "bg-black text-white" : ""}`}
            >
              {mode}
            </Link>
          ))}
        </div>
      </div>
      <GameClient defaultMode={defaultMode} />
    </section>
  );
}

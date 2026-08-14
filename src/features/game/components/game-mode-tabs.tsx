"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { GameModeName } from "@/domain/game/modes";

interface GameModeTabsProps {
  activeMode: GameModeName;
  availableModes: readonly GameModeName[];
  onSelect?: (mode: GameModeName) => void;
}

export function GameModeTabs({ activeMode, availableModes, onSelect }: GameModeTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hrefForMode = (mode: GameModeName) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", mode);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav className="flex gap-3" aria-label="Game mode">
      {availableModes.map((mode) => {
        const isActive = activeMode === mode;

        return (
          <Link
            key={mode}
            href={hrefForMode(mode)}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onSelect?.(mode)}
            className={`border-b-2 px-1 py-1 capitalize transition-colors hover:no-underline ${
              isActive
                ? "border-black font-semibold text-black"
                : "border-transparent text-black/55 hover:text-black"
            }`}
          >
            {mode}
          </Link>
        );
      })}
    </nav>
  );
}

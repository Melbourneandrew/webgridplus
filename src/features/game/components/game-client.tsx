"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculateBps, calculateNtpm } from "@/domain/scoring";
import { gameModeByName, type GameModeName } from "@/domain/game/modes";
import {
  createGridGameState,
  type GameState,
  registerCellClick,
  resetSession,
  tickSession,
} from "@/domain/game/session";
import { pickDifferentCell } from "@/domain/game/grid";

type SubmissionResponse = {
  rank?: number | null;
  average?: number | null;
};

export function GameClient({ defaultMode }: { defaultMode: GameModeName }) {
  const [state, setState] = useState(() => createGridGameState(defaultMode));
  const [results, setResults] = useState<SubmissionResponse | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modeConfig = gameModeByName[state.mode];

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem("hasVisitedWebgrid")) {
      setShowWelcome(false);
    }
  }, []);

  const ntpm = useMemo(() => {
    return calculateNtpm(state.correctClicks, state.incorrectClicks, modeConfig.timeSeconds);
  }, [state.correctClicks, state.incorrectClicks, modeConfig.timeSeconds]);

  const bps = useMemo(() => calculateBps(ntpm, modeConfig.gridSize), [modeConfig.gridSize, ntpm]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetGame = (nextMode?: GameModeName) => {
    clearTimer();
    const next = resetSession(state, nextMode);
    setState(next);
    setResults(null);
  };

  const scoreForState = (gameState: GameState) => {
    const config = gameModeByName[gameState.mode];
    const finalNtpm = calculateNtpm(gameState.correctClicks, gameState.incorrectClicks, config.timeSeconds);
    return {
      mode: gameState.mode,
      ntpm: finalNtpm,
      bps: calculateBps(finalNtpm, config.gridSize),
    };
  };

  const stopAndFinish = async (gameState: GameState) => {
    const finalScore = scoreForState(gameState);
    const response = await fetch("/api/games", {
      method: "POST",
      body: JSON.stringify({
        gameType: finalScore.mode,
        ntpm: finalScore.ntpm,
        bps: finalScore.bps,
      }),
      headers: { "content-type": "application/json" },
    });

    if (response.ok) {
      const payload = (await response.json()) as SubmissionResponse;
      setResults({
        rank: payload.rank ?? null,
        average: payload.average ?? null,
      });
    } else {
      setResults(null);
    }
  };

  const startTimer = () => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setState((current) => {
        const updated = tickSession(current);
        if (updated.isGameOver) {
          clearTimer();
          void stopAndFinish(updated);
        }
        return updated;
      });
    }, 1000);
  };

  const handleCellClick = (row: number, col: number) => {
    if (state.isGameOver) {
      return;
    }

    const shouldStart = !state.isGameStarted;
    const next = registerCellClick(
      state,
      row,
      col,
      (size, previous) => pickDifferentCell(size, previous),
    );

    if (shouldStart && !next.isGameStarted) {
      return;
    }
    if (shouldStart) {
      setState(next);
      startTimer();
    } else {
      setState(next);
    }
  };

  return (
    <div className="space-y-4">
      {showWelcome ? (
        <div className="rounded border p-3">
          <p className="font-bold">Welcome to Webgrid+</p>
          <p className="text-sm text-gray-500">First-time visitors can skip this prompt forever.</p>
          <button
            onClick={() => {
              setShowWelcome(false);
              window.localStorage.setItem("hasVisitedWebgrid", "true");
            }}
            className="mt-2 rounded bg-black px-3 py-1 text-white"
          >
            I want to play
          </button>
        </div>
      ) : null}

      <div className="flex gap-2">
        <button onClick={() => resetGame("regular")} className={`rounded border px-3 py-1 ${state.mode === "regular" ? "bg-black text-white" : ""}`}>Regular</button>
        <button onClick={() => resetGame("blitz")} className={`rounded border px-3 py-1 ${state.mode === "blitz" ? "bg-black text-white" : ""}`}>Blitz</button>
      </div>

      <div className="flex flex-col items-center gap-2">
      <div className="text-5xl font-bold">{String(state.secondsLeft).padStart(2, "0")}:00</div>
        <div className="text-4xl font-semibold">{bps.toFixed(2)} BPS</div>
        <div className="text-lg text-gray-500">
          {Math.round(ntpm)} NTMP · {modeConfig.gridSize}x{modeConfig.gridSize}
        </div>
      </div>

      <div className="grid-30 gap-0 rounded border">
        {Array.from({ length: modeConfig.gridSize ** 2 }).map((_, index) => {
          const row = (index % modeConfig.gridSize) + 1;
          const col = Math.floor(index / modeConfig.gridSize) + 1;
          const isActive = row === state.activeCell.row && col === state.activeCell.col;
          return (
            <button
              key={`${row}-${col}`}
              type="button"
              onClick={() => handleCellClick(row, col)}
              className={`aspect-square border border-black/30 ${isActive ? "bg-blue-600" : "hover:bg-gray-200"}`}
            />
          );
        })}
      </div>

      <div className="text-center">
        {state.isGameOver ? (
          <div>
            <p className="text-2xl">Your score: {bps.toFixed(2)} BPS</p>
            {results && results.rank != null ? <p>Rank: {results.rank}</p> : null}
            {results && results.average != null ? <p>All-time average: {results.average.toFixed(2)} BPS</p> : <p className="text-sm text-gray-500">Sign in to save this score.</p>}
            <button onClick={() => resetGame()} className="mt-2 rounded border px-3 py-1">Play Again</button>
          </div>
        ) : null}
      </div>

      {!state.isGameOver ? <button onClick={() => resetGame()} className="rounded border px-3 py-1">Reset</button> : null}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculateBps, calculateNtpm } from "@/domain/scoring";
import { gameModeByName, gridDimension, type GameModeName } from "@/domain/game/mode";
import { createGridGameState } from "@/domain/game/session";

type SubmissionResponse = {
  rank?: number | null;
  average?: number | null;
};

export function GameClient({ defaultMode }: { defaultMode: GameModeName }) {
  const [mode, setMode] = useState<GameModeName>(defaultMode);
  const [state, setState] = useState(() => createGridGameState(defaultMode));
  const [activeCell, setActiveCell] = useState({ row: state.activeCell.row, col: state.activeCell.col });
  const [results, setResults] = useState<SubmissionResponse | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem("hasVisitedWebgrid")) {
      setShowWelcome(false);
    }
  }, []);

  const ntpm = useMemo(() => {
    return calculateNtpm(state.correctClicks, state.incorrectClicks, gameModeByName[mode].timeSeconds);
  }, [state.correctClicks, state.incorrectClicks, mode]);

  const bps = useMemo(() => calculateBps(ntpm), [ntpm]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetGame = (nextMode?: GameModeName) => {
    clearTimer();
    const resolvedMode = nextMode ?? mode;
    const next = createGridGameState(resolvedMode);
    setState(next);
    setMode(resolvedMode);
    setActiveCell(next.activeCell);
    setResults(null);
  };

  const stopAndFinish = async () => {
    const response = await fetch("/api/games", {
      method: "POST",
      body: JSON.stringify({ gameType: mode, ntpm, bps }),
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
        const nextSeconds = current.secondsLeft - 1;
        if (nextSeconds <= 0) {
          clearTimer();
          void stopAndFinish();
          return { ...current, secondsLeft: 0, isGameOver: true, isGameStarted: false };
        }
        return { ...current, secondsLeft: nextSeconds };
      });
    }, 1000);
  };

  const handleCellClick = (row: number, col: number) => {
    if (state.isGameOver) return;
    if (!state.isGameStarted) {
      setState((current) => ({
        ...current,
        isGameStarted: true,
      }));
      startTimer();
    }

    if (row === activeCell.row && col === activeCell.col) {
      setState((current) => ({
        ...current,
        correctClicks: current.correctClicks + 1,
      }));
      setActiveCell({
        row: Math.floor(Math.random() * gridDimension) + 1,
        col: Math.floor(Math.random() * gridDimension) + 1,
      });
    } else {
      setState((current) => ({
        ...current,
        incorrectClicks: current.incorrectClicks + 1,
      }));
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
        <button onClick={() => resetGame("regular")} className={`rounded border px-3 py-1 ${mode === "regular" ? "bg-black text-white" : ""}`}>Regular</button>
        <button onClick={() => resetGame("blitz")} className={`rounded border px-3 py-1 ${mode === "blitz" ? "bg-black text-white" : ""}`}>Blitz</button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="text-5xl font-bold">{String(state.secondsLeft).padStart(2, "0")}:00</div>
        <div className="text-4xl font-semibold">{bps.toFixed(2)} BPS</div>
        <div className="text-lg text-gray-500">{Math.round(ntpm)} NTMP · 30x30</div>
      </div>

      <div className="grid-30 gap-0 rounded border">
        {Array.from({ length: 900 }).map((_, index) => {
          const row = (index % 30) + 1;
          const col = Math.floor(index / 30) + 1;
          const isActive = row === activeCell.row && col === activeCell.col;
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

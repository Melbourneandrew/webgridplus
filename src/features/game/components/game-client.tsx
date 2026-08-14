"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculateBps, calculateNtpm } from "@/domain/scoring";
import { gameModeByName, type GameModeName } from "@/domain/game/modes";
import {
  createGridGameState,
  type GameState,
  registerCellClick,
  resetSession,
  syncSessionClock,
} from "@/domain/game/session";
import { pickDifferentCell } from "@/domain/game/grid";
import { GameBoard } from "./game-board";
import { GameModeTabs } from "./game-mode-tabs";
import { useResponsiveGridSize } from "../hooks/use-responsive-grid-size";

type SubmissionResponse = {
  rank?: number | null;
  average?: number | null;
};

interface GameClientProps {
  defaultMode: GameModeName;
  availableModes: readonly GameModeName[];
}

export function GameClient({ defaultMode, availableModes }: GameClientProps) {
  const [state, setState] = useState(() => createGridGameState(defaultMode));
  const [results, setResults] = useState<SubmissionResponse | null>(null);
  const [misclickCell, setMisclickCell] = useState<string | null>(null);
  const responsiveGridSize = useResponsiveGridSize();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const misclickFlashRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modeConfig = gameModeByName[state.mode];

  const ntpm = useMemo(() => {
    return calculateNtpm(state.correctClicks, state.incorrectClicks, modeConfig.timeSeconds);
  }, [state.correctClicks, state.incorrectClicks, modeConfig.timeSeconds]);

  const bps = useMemo(() => calculateBps(ntpm, state.gridSize), [state.gridSize, ntpm]);

  useEffect(() => {
    setState((current) => current.gridSize === responsiveGridSize
      ? current
      : createGridGameState(current.mode, responsiveGridSize));
    setResults(null);
    clearTimer();
  }, [responsiveGridSize]);

  useEffect(() => {
    setState((current) => current.mode === defaultMode
      ? current
      : createGridGameState(defaultMode, responsiveGridSize));
    setResults(null);
    clearTimer();
    clearMisclickFlash();
  }, [defaultMode, responsiveGridSize]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearMisclickFlash = () => {
    if (misclickFlashRef.current) {
      clearTimeout(misclickFlashRef.current);
      misclickFlashRef.current = null;
    }
    setMisclickCell(null);
  };

  useEffect(() => () => {
    clearTimer();
    if (misclickFlashRef.current) clearTimeout(misclickFlashRef.current);
  }, []);

  const resetGame = (nextMode?: GameModeName) => {
    clearTimer();
    clearMisclickFlash();
    const next = resetSession(state, nextMode, responsiveGridSize);
    setState(next);
    setResults(null);
  };

  const selectMode = (mode: GameModeName) => {
    if (mode === state.mode) return;
    resetGame(mode);
  };

  const scoreForState = (gameState: GameState) => {
    const config = gameModeByName[gameState.mode];
    const finalNtpm = calculateNtpm(gameState.correctClicks, gameState.incorrectClicks, config.timeSeconds);
    return {
      mode: gameState.mode,
      ntpm: finalNtpm,
      bps: calculateBps(finalNtpm, gameState.gridSize),
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
        const updated = syncSessionClock(current, Date.now());
        if (updated.isGameOver) {
          clearTimer();
          void stopAndFinish(updated);
        }
        return updated;
      });
    }, 100);
  };

  const handleCellClick = (row: number, col: number) => {
    if (state.isGameOver) {
      return;
    }

    const shouldStart = !state.isGameStarted;
    const isMisclick = row !== state.activeCell.row || col !== state.activeCell.col;
    const next = registerCellClick(
      state,
      row,
      col,
      (size, previous) => pickDifferentCell(size, previous),
    );

    if (shouldStart && !next.isGameStarted) {
      return;
    }
    if (isMisclick) {
      if (misclickFlashRef.current) clearTimeout(misclickFlashRef.current);
      setMisclickCell(`${row}-${col}`);
      misclickFlashRef.current = setTimeout(() => {
        setMisclickCell(null);
        misclickFlashRef.current = null;
      }, 150);
    }
    if (shouldStart) {
      setState(next);
      startTimer();
    } else {
      setState(next);
    }
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(220px,300px)_minmax(0,1fr)] lg:gap-10">
      <aside className="flex flex-col items-center gap-5 lg:sticky lg:top-6 lg:items-start">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold">Play Webgrid+</h1>
          <p className="mt-1 text-sm text-gray-500">Click the blue square to begin. Misclicks are penalized.</p>
        </div>

        <GameModeTabs
          activeMode={state.mode}
          availableModes={availableModes}
          onSelect={selectMode}
        />

        <div className="flex flex-col items-center gap-2 lg:items-start">
          <div className="text-5xl font-bold tabular-nums">{String(state.secondsLeft).padStart(2, "0")}:00</div>
          <div className="text-4xl font-semibold tabular-nums">{bps.toFixed(2)} BPS</div>
          <div className="text-lg text-gray-500">
            {Math.round(ntpm)} NTMP · {state.gridSize}x{state.gridSize}
          </div>
        </div>

        {state.isGameOver ? (
          <div className="text-center lg:text-left">
            <p className="text-2xl">Your score: {bps.toFixed(2)} BPS</p>
            {results && results.rank != null ? <p>Rank: {results.rank}</p> : null}
            {results && results.average != null ? <p>All-time average: {results.average.toFixed(2)} BPS</p> : <p className="text-sm text-gray-500">Sign in to save this score.</p>}
            <button onClick={() => resetGame()} className="mt-2 border border-black px-3 py-1">Play Again</button>
          </div>
        ) : null}
        {!state.isGameOver ? <button onClick={() => resetGame()} className="border border-black px-3 py-1">Reset</button> : null}
      </aside>

      <GameBoard
        size={state.gridSize}
        activeCell={state.activeCell}
        misclickCell={misclickCell}
        onCellClick={handleCellClick}
      />
    </div>
  );
}

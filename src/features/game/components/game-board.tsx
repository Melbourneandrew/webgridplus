import type { GridCell } from "@/domain/game/grid";

interface GameBoardProps {
  size: number;
  activeCell: GridCell;
  misclickCell: string | null;
  onCellClick: (row: number, col: number) => void;
}

export function GameBoard({ size, activeCell, misclickCell, onCellClick }: GameBoardProps) {
  return (
    <div
      aria-label="Game grid"
      data-grid-size={size}
      className="mx-auto grid w-[min(100%,calc(100dvh-8.5rem))] max-w-[720px] gap-0 rounded border lg:mx-0 lg:justify-self-end"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: size ** 2 }, (_, index) => {
        const row = Math.floor(index / size) + 1;
        const col = (index % size) + 1;
        const cellKey = `${row}-${col}`;
        const isActive = row === activeCell.row && col === activeCell.col;
        const isMisclicked = misclickCell === cellKey;
        return (
          <button
            key={cellKey}
            type="button"
            aria-label={isActive ? "Active target" : undefined}
            onClick={() => onCellClick(row, col)}
            className={`aspect-square border border-black/30 transition-colors duration-75 ${isMisclicked ? "bg-red-600" : isActive ? "bg-blue-600" : "hover:bg-black/20"}`}
          />
        );
      })}
    </div>
  );
}

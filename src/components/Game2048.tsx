"use client";

import { useState, useEffect, useCallback } from "react";

type Cell = { value: number; id: number };

function initBoard(): (number | null)[] {
  const b = Array(16).fill(null);
  addTile(b); addTile(b);
  return b;
}

function addTile(b: (number | null)[]) {
  const empty = b.map((v, i) => v === null ? i : -1).filter(i => i >= 0);
  if (empty.length === 0) return;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  b[idx] = Math.random() < 0.9 ? 2 : 4;
}

function slideRow(row: (number | null)[]): { newRow: (number | null)[]; score: number } {
  let filtered: (number | null)[] = row.filter(v => v !== null);
  let score = 0;
  for (let i = 0; i < filtered.length - 1; i++) {
    const a = filtered[i] as number;
    const b = filtered[i + 1] as number;
    if (a === b) {
      filtered[i] = a * 2;
      score += a * 2;
      filtered.splice(i + 1, 1);
    }
  }
  while (filtered.length < 4) filtered.push(null);
  return { newRow: filtered, score };
}

function moveBoard(board: (number | null)[], dir: "up"|"down"|"left"|"right"): { board: (number | null)[]; score: number } {
  const newBoard: (number | null)[] = Array(16).fill(null);
  let totalScore = 0;

  if (dir === "left" || dir === "right") {
    for (let r = 0; r < 4; r++) {
      let row: (number | null)[] = [];
      for (let c = 0; c < 4; c++) row.push(board[r * 4 + c]);
      if (dir === "right") row.reverse();
      const { newRow, score } = slideRow(row);
      if (dir === "right") newRow.reverse();
      for (let c = 0; c < 4; c++) newBoard[r * 4 + c] = newRow[c];
      totalScore += score;
    }
  } else {
    for (let c = 0; c < 4; c++) {
      let col: (number | null)[] = [];
      for (let r = 0; r < 4; r++) col.push(board[r * 4 + c]);
      if (dir === "down") col.reverse();
      const { newRow, score } = slideRow(col);
      if (dir === "down") newRow.reverse();
      for (let r = 0; r < 4; r++) newBoard[r * 4 + c] = newRow[r];
      totalScore += score;
    }
  }

  return { board: newBoard, score: totalScore };
}

const COLORS: Record<number, string> = {
  0: "#cdc1b4", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179",
  16: "#f59563", 32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72",
  256: "#edcc61", 512: "#edc850", 1024: "#edc53f", 2048: "#edc22e",
};

export default function Game2048() {
  const [board, setBoard] = useState<(number | null)[]>(() => initBoard());
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);

  const handleMove = useCallback((dir: "up"|"down"|"left"|"right") => {
    setBoard(prev => {
      const { board: newB, score: s } = moveBoard(prev, dir);
      // check if board actually changed
      if (newB.every((v, i) => v === prev[i])) return prev;
      const next = [...newB];
      addTile(next);
      setScore(p => p + s);
      if (next.some(v => v === 2048) && !won) setWon(true);
      return next;
    });
  }, [won]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") { e.preventDefault(); handleMove("up"); }
      else if (e.key === "ArrowDown") { e.preventDefault(); handleMove("down"); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); handleMove("left"); }
      else if (e.key === "ArrowRight") { e.preventDefault(); handleMove("right"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleMove]);

  const reset = () => { setBoard(initBoard()); setScore(0); setWon(false); };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex items-center gap-6">
        <div className="text-2xl font-bold text-[var(--color-accent)]">2048</div>
        <div className="rounded-lg bg-[var(--color-secondary)]/20 px-4 py-1.5 text-lg font-semibold text-[var(--color-accent)]">Score: {score}</div>
        <button onClick={reset} className="rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary)] hover:opacity-80">New Game</button>
      </div>
      <div className="relative rounded-xl bg-[#bbada0] p-2 shadow-lg" style={{ width: 360, height: 360 }}>
        {board.map((val, i) => {
          const x = (i % 4) * 88 + 4;
          const y = Math.floor(i / 4) * 88 + 4;
          return (
            <div
              key={i}
              className="absolute flex items-center justify-center rounded-lg font-bold transition-all duration-100"
              style={{
                width: 80, height: 80,
                left: x, top: y,
                backgroundColor: val ? (COLORS[val] || "#3c3a32") : COLORS[0],
                color: val && val <= 4 ? "#776e65" : "#f9f6f2",
                fontSize: val && val >= 1024 ? 24 : val && val >= 128 ? 28 : 36,
              }}
            >
              {val || ""}
            </div>
          );
        })}
      </div>
      {won && <p className="text-lg font-bold text-[var(--color-accent)]">🎉 You reached 2048! Keep going!</p>}
      <p className="text-sm text-[var(--color-accent)]/40">方向键移动 · 相同数字合并</p>
    </div>
  );
}

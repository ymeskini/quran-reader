import { useState, useEffect, useCallback } from "react";
import { QuranPage } from "./QuranPage";

export function App() {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("1");

  const goTo = useCallback((p: number) => {
    const clamped = Math.max(1, Math.min(604, p));
    setPage(clamped);
    setInputValue(String(clamped));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(page + 1);
      if (e.key === "ArrowRight") goTo(page - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [page, goTo]);

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = parseInt(inputValue);
      if (!isNaN(val)) goTo(val);
    }
  };

  return (
    <>
      <nav className="nav">
        <button onClick={() => goTo(page + 1)} disabled={page >= 604}>
          →
        </button>
        <input
          type="number"
          min={1}
          max={604}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInput}
          onBlur={() => {
            const val = parseInt(inputValue);
            if (!isNaN(val)) goTo(val);
          }}
        />
        <button onClick={() => goTo(page - 1)} disabled={page <= 1}>
          ←
        </button>
      </nav>
      <QuranPage pageNum={page} />
    </>
  );
}

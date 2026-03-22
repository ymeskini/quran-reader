import { useState } from "react";

interface NavProps {
  page: number;
  onNavigate: (page: number) => void;
}

export function Nav({ page, onNavigate }: NavProps) {
  const [inputValue, setInputValue] = useState(String(page));

  const goTo = (p: number) => {
    const clamped = Math.max(1, Math.min(604, p));
    setInputValue(String(clamped));
    onNavigate(clamped);
  };

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = parseInt(inputValue);
      if (!isNaN(val)) goTo(val);
    }
  };

  return (
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
  );
}

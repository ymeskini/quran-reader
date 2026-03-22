import { useState, useEffect, useCallback } from "react";
import { Nav } from "./components/Nav";
import { QuranPage } from "./QuranPage";

export function App() {
  const [page, setPage] = useState(1);

  const goTo = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(604, p)));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(page + 1);
      if (e.key === "ArrowRight") goTo(page - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [page, goTo]);

  return (
    <>
      <Nav page={page} onNavigate={goTo} />
      <QuranPage pageNum={page} />
    </>
  );
}

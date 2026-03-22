import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Nav } from "../Nav/Nav";
import { QuranPage } from "../QuranPage/QuranPage";
import { TafsirDrawer } from "../TafsirDrawer/TafsirDrawer";
import styles from "./App.module.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});

export function App() {
  const [page, setPage] = useState(1);
  const [tafsirAyah, setTafsirAyah] = useState<string | null>(null);

  const goTo = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(604, p)));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <main className={styles.app}>
        <Nav page={page} onNavigate={goTo} />
        <QuranPage pageNum={page} onWordClick={setTafsirAyah} />
        <TafsirDrawer
          ayahKey={tafsirAyah}
          onClose={() => setTafsirAyah(null)}
        />
      </main>
    </QueryClientProvider>
  );
}

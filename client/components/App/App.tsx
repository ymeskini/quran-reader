import { useState, useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";

import { ChevronLeft, ChevronRight } from "lucide-react";
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

const TOTAL_PAGES = 604;
const LOAD_RANGE = 3;

export function App() {
  const [page, setPage] = useState(1);
  const [tafsirAyah, setTafsirAyah] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 0,
    direction: "rtl",
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setPage(idx + 1);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const goNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const goPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className={styles.app}>
        <button
          className={styles.arrowButton + " " + styles.arrowRight}
          onClick={goNext}
          aria-label="الصفحة التالية"
        >
          <ChevronRight size={32} />
        </button>
        <div className={styles.carousel} ref={emblaRef}>
          <div className={styles.carouselContainer}>
            {Array.from({ length: TOTAL_PAGES }, (_, i) => {
              const p = i + 1;
              const inRange = Math.abs(p - page) <= LOAD_RANGE;
              return (
                <div className={styles.carouselSlide} key={p}>
                  {inRange ? (
                    <QuranPage pageNum={p} onWordClick={setTafsirAyah} />
                  ) : (
                    <div className={styles.placeholder} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <button
          className={styles.arrowButton + " " + styles.arrowLeft}
          onClick={goPrev}
          aria-label="الصفحة السابقة"
        >
          <ChevronLeft size={32} />
        </button>
        <TafsirDrawer
          ayahKey={tafsirAyah}
          page={page}
          onClose={() => setTafsirAyah(null)}
        />
      </main>
      <span className={styles.pageNumber}>{page}</span>
    </QueryClientProvider>
  );
}

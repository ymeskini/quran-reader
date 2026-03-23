import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { PageData } from "../../types";
import { ensurePageFont } from "../../fonts";
import { QuranLine } from "../QuranLine/QuranLine";
import styles from "./QuranPage.module.css";

const isDev = location.port === "3000";

async function fetchPage(pageNum: number): Promise<PageData> {
  const url = isDev ? `/api/page/${pageNum}` : `/api/page/${pageNum}.json`;
  const res = await fetch(url);
  return res.json();
}

function pageQueryOptions(pageNum: number) {
  return {
    queryKey: ["page", pageNum],
    queryFn: () => fetchPage(pageNum),
    staleTime: Infinity,
    gcTime: Infinity,
  };
}

export function QuranPage({
  pageNum,
  onWordClick,
}: {
  pageNum: number;
  onWordClick?: (ayahKey: string) => void;
}) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(pageQueryOptions(pageNum));

  // Load font for current page
  useEffect(() => {
    ensurePageFont(pageNum);
  }, [pageNum]);

  // Prefetch adjacent pages
  useEffect(() => {
    for (const offset of [1, -1]) {
      const next = pageNum + offset;
      if (next >= 1 && next <= 604) {
        ensurePageFont(next);
        queryClient.prefetchQuery(pageQueryOptions(next));
      }
    }
  }, [pageNum, queryClient]);

  const [hoveredAyah, setHoveredAyah] = useState<string | null>(null);

  if (isLoading || !data) return <div className={styles.loading}>Loading...</div>;

  const totalLines = 15;

  return (
    <div className={styles.page}>
      {data.lines.map((line) => (
        <QuranLine key={line.lineNumber} line={line} pageNum={pageNum} onWordClick={onWordClick} hoveredAyah={hoveredAyah} onAyahHover={setHoveredAyah} />
      ))}
      {Array.from({ length: totalLines - data.lines.length }).map((_, i) => (
        <div key={`empty-${i}`} className={styles.emptyLine} />
      ))}
    </div>
  );
}

import type { Line, AyahLine, SurahNameLine } from "../../types";
import { fontFamily } from "../../fonts";
import { Basmallah } from "../Basmallah/Basmallah";
import styles from "./QuranLine.module.css";

export function QuranLine({
  line,
  pageNum,
  onWordClick,
}: {
  line: Line;
  pageNum: number;
  onWordClick?: (ayahKey: string) => void;
}) {
  if (line.type === "surah_name") {
    const surahNum = (line as SurahNameLine).surahNumber;
    const surahText = `surah${String(surahNum).padStart(3, "0")}`;
    return (
      <div className={styles.surahHeader}>
        <div className={styles.surahName}>{surahText}</div>
      </div>
    );
  }

  if (line.type === "basmallah") {
    return (
      <div className={styles.basmallah}>
        <Basmallah />
      </div>
    );
  }

  const ayahLine = line as AyahLine;
  const font = fontFamily(pageNum);

  return (
    <div
      className={`${styles.line} ${ayahLine.centered ? styles.centered : styles.justified}`}
    >
      {ayahLine.words.map((word) => {
        const parts = word.location.split(":");
        const ayahKey = `${parts[0]}:${parts[1]}`;
        return (
          <span
            key={word.id}
            className={styles.word}
            style={{ fontFamily: font }}
            title={word.location}
            onClick={() => onWordClick?.(ayahKey)}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
}

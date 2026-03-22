import type { Line, AyahLine, SurahNameLine } from "./types";
import { fontFamily } from "./fonts";
import { Basmallah } from "./components/Basmallah";

export function QuranLine({ line, pageNum }: { line: Line; pageNum: number }) {
  if (line.type === "surah_name") {
    const surahNum = (line as SurahNameLine).surahNumber;
    const surahText = `surah${String(surahNum).padStart(3, "0")}`;
    return (
      <div className="surah-header">
        <div className="surah-name">{surahText}</div>
      </div>
    );
  }

  if (line.type === "basmallah") {
    return (
      <div className="basmallah">
        <Basmallah />
      </div>
    );
  }

  const ayahLine = line as AyahLine;
  const font = fontFamily(pageNum);

  return (
    <div
      className={`quran-line ${ayahLine.centered ? "centered" : "justified"}`}
    >
      {ayahLine.words.map((word) => (
        <span
          key={word.id}
          className="word"
          style={{ fontFamily: font }}
          title={word.location}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}

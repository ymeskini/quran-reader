import { getPageLines, getWords } from "./db";
import { SURAH_NAMES } from "./surah-names";

function getPageData(pageNumber: number) {
  const lines = getPageLines.all(pageNumber) as any[];

  return lines.map((line) => {
    if (line.line_type === "surah_name") {
      return {
        lineNumber: line.line_number,
        type: "surah_name",
        centered: true,
        surahNumber: line.surah_number,
        surahName:
          SURAH_NAMES[line.surah_number] || `سورة ${line.surah_number}`,
      };
    }

    if (line.line_type === "basmallah") {
      return {
        lineNumber: line.line_number,
        type: "basmallah",
        centered: true,
      };
    }

    const words = getWords.all(line.first_word_id, line.last_word_id) as any[];
    return {
      lineNumber: line.line_number,
      type: "ayah",
      centered: !!line.is_centered,
      words: words.map((w) => ({
        id: w.id,
        text: w.text,
        location: w.location,
      })),
    };
  });
}

export const apiRoutes = {
  "/api/page/:num": (req: Request & { params: { num: string } }) => {
    const num = parseInt(req.params.num);
    if (isNaN(num) || num < 1 || num > 604) {
      return Response.json({ error: "Page must be 1-604" }, { status: 400 });
    }
    return Response.json({ page: num, lines: getPageData(num) });
  },
  "/fonts/:file": (req: Request & { params: { file: string } }) => {
    const file = Bun.file(`public/fonts/${req.params.file}`);
    return new Response(file, {
      headers: {
        "Content-Type": "font/ttf",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  },
};

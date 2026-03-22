import { getPageLines, getWords, getTafsir } from "./db";
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
  "/api/tafsir/:surah/:ayah": (req: Request & { params: { surah: string; ayah: string } }) => {
    const surah = parseInt(req.params.surah);
    const ayah = parseInt(req.params.ayah);
    if (isNaN(surah) || isNaN(ayah) || surah < 1 || surah > 114 || ayah < 1) {
      return Response.json({ error: "Invalid surah or ayah number" }, { status: 400 });
    }

    const row = getTafsir.get(`${surah}:${ayah}`) as any;
    if (!row) {
      return Response.json({ error: "Tafsir not found" }, { status: 404 });
    }

    return Response.json({
      ayah_key: row.ayah_key,
      text: row.text,
    });
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

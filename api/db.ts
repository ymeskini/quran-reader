import { Database } from "bun:sqlite";

export const linesDb = new Database(new URL("data/qpc-v2-15-lines.db", import.meta.url).pathname, { readonly: true });
export const wordsDb = new Database(new URL("data/qpc-v2.db", import.meta.url).pathname, { readonly: true });

export const getPageLines = linesDb.prepare(
  "SELECT line_number, line_type, is_centered, first_word_id, last_word_id, surah_number FROM pages WHERE page_number = ? ORDER BY line_number",
);

export const getWords = wordsDb.prepare(
  "SELECT id, text, location FROM words WHERE id BETWEEN ? AND ? ORDER BY id",
);

export const tafsirDb = new Database(new URL("data/tafsir-as-saadi.db", import.meta.url).pathname, { readonly: true });

export const getTafsir = tafsirDb.prepare(
  "SELECT ayah_key, text FROM tafsir WHERE ayah_key = ?",
);

export function getPageTafsir(pageNumber: number): Record<string, string> {
  const lines = getPageLines.all(pageNumber) as any[];
  const ayahKeys = new Set<string>();
  for (const line of lines) {
    if (line.line_type !== "ayah") continue;
    const words = getWords.all(line.first_word_id, line.last_word_id) as any[];
    for (const w of words) {
      const parts = w.location.split(":");
      ayahKeys.add(`${parts[0]}:${parts[1]}`);
    }
  }
  const map: Record<string, string> = {};
  for (const key of ayahKeys) {
    const row = getTafsir.get(key) as any;
    if (row) map[row.ayah_key] = row.text;
  }
  return map;
}

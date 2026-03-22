import { Database } from "bun:sqlite";

export const linesDb = new Database(new URL("qpc-v2-15-lines.db", import.meta.url).pathname, { readonly: true });
export const wordsDb = new Database(new URL("qpc-v2.db", import.meta.url).pathname, { readonly: true });

export const getPageLines = linesDb.prepare(
  "SELECT line_number, line_type, is_centered, first_word_id, last_word_id, surah_number FROM pages WHERE page_number = ? ORDER BY line_number",
);

export const getWords = wordsDb.prepare(
  "SELECT id, text, location FROM words WHERE id BETWEEN ? AND ? ORDER BY id",
);

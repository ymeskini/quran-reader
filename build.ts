import { mkdir, cp } from "node:fs/promises";

import { SURAH_NAMES } from "./api/surah-names";
import { linesDb, wordsDb, getPageLines, getWords } from "./api/db";

const OUT = "dist";

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

// 1. Build client bundle
console.log("Building client...");
const buildResult = await Bun.build({
  entrypoints: ["./client/index.tsx"],
  outdir: `${OUT}/assets`,
  minify: true,
  splitting: true,
});

if (!buildResult.success) {
  console.error("Build failed:", buildResult.logs);
  process.exit(1);
}

// Get the output JS filename
const jsFile = buildResult.outputs.find((o) => o.path.endsWith(".js"));
const cssFile = buildResult.outputs.find((o) => o.path.endsWith(".css"));
const jsName = jsFile ? jsFile.path.split("/").pop() : "index.js";
const cssName = cssFile ? cssFile.path.split("/").pop() : null;

// 2. Generate index.html
console.log("Generating index.html...");
const cssLink = cssName
  ? `<link rel="stylesheet" href="/assets/${cssName}">`
  : "";
await Bun.write(
  `${OUT}/index.html`,
  `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quran Reader</title>
  ${cssLink}
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/assets/${jsName}"></script>
</body>
</html>`,
);

// 3. Generate static JSON for all 604 pages
console.log("Generating page data...");
await mkdir(`${OUT}/api/page`, { recursive: true });
for (let i = 1; i <= 604; i++) {
  const data = { page: i, lines: getPageData(i) };
  await Bun.write(`${OUT}/api/page/${i}.json`, JSON.stringify(data));
}

// 4. Copy fonts
console.log("Copying fonts...");
await cp("public/fonts", `${OUT}/fonts`, { recursive: true });

linesDb.close();
wordsDb.close();

console.log(`Build complete → ${OUT}/`);

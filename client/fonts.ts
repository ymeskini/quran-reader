// Load surah name font once
const surahStyle = document.createElement("style");
surahStyle.textContent = `
  @font-face {
    font-family: "SurahNameV2";
    src: url("/fonts/surah-name-v2.ttf") format("truetype");
    font-display: swap;
  }
`;
document.head.appendChild(surahStyle);

const loadedFonts = new Set<number>();

export function ensurePageFont(pageNum: number) {
  if (loadedFonts.has(pageNum)) return;
  loadedFonts.add(pageNum);
  const name = `QCF_P${String(pageNum).padStart(3, "0")}`;
  const url = `/fonts/p${pageNum}.ttf`;

  // Register the font face
  const font = new FontFace(name, `url(${url})`);
  font.load().then((loaded) => document.fonts.add(loaded));
}

export function fontFamily(pageNum: number) {
  return `QCF_P${String(pageNum).padStart(3, "0")}`;
}

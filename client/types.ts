export interface Word {
  id: number;
  text: string;
  location: string;
}

export interface AyahLine {
  lineNumber: number;
  type: "ayah";
  centered: boolean;
  words: Word[];
}

export interface SurahNameLine {
  lineNumber: number;
  type: "surah_name";
  centered: boolean;
  surahNumber: number;
  surahName: string;
}

export interface BasmallahLine {
  lineNumber: number;
  type: "basmallah";
  centered: boolean;
}

export type Line = AyahLine | SurahNameLine | BasmallahLine;

export interface PageData {
  page: number;
  lines: Line[];
}

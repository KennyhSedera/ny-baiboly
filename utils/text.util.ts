import { LangType } from "@/api/langues.repository";
import { en, fr, mg } from "@/constants/text";
import { versesBible } from "@/types/bible";

export function searchVerses(query: string, allVerses: versesBible[], bookId?: number): versesBible[] {
  if (!query.trim()) return [];

  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const q = normalize(query);

  return allVerses.filter((v) => {
    if (bookId && v.book_number !== bookId) return false;
    return normalize(v.text).includes(q);
  });
}

export const capitalizeText = (text: string) => {

  if (Number(text.charAt(0))) {
    return text.replace(text.charAt(1), text.charAt(1).toLocaleUpperCase());
  }
  return text.replace(text.charAt(0), text.charAt(0).toLocaleUpperCase());
}

export const getLanguage = (lng: LangType) => {
  return lng === "fr" ? fr : lng === "en" ? en : mg
}

export function parseVerse(value: string): [number | undefined, number | undefined] {
  if (!value.trim()) {
    return [undefined, undefined];
  }

  const parts = value.split('-').map((v) => v.trim());

  const start = parts[0] ? Number(parts[0]) : undefined;
  const end = parts[1] ? Number(parts[1]) : undefined;

  return [start, end];
}

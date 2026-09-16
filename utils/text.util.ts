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

export const capitalizeText = (text: string): string => {
  if (!text) return "";

  const match = text.match(/^\d+\s*/);
  const startIndex = match ? match[0].length : 0;

  return (
    text.slice(0, startIndex) +
    text.charAt(startIndex).toLocaleUpperCase() +
    text.slice(startIndex + 1)
  );
};

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

export function convertVersesToArrayNumber(value: string): number[] {
  const verseNumbers = value
    ? value.split(",").map(v => Number(v.trim()))
    : [];

  return verseNumbers
}

import { colors } from "@/constants/colors";
import { Colors } from "@/types/colors.type";

/**
 * Éclaircit ou assombrit une couleur hex.
 * @param hex couleur de départ, ex: '#494949'
 * @param percent pourcentage d'ajustement : positif = éclaircir, négatif = assombrir
 *                ex: 20 -> +20%, -20 -> -20%
 */
export function adjustColor(hex: string, percent: number): string {
  const clean = hex.replace('#', '');

  const num = parseInt(clean, 16);

  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  const amount = Math.round(2.55 * percent);

  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));

  const toHex = (v: number) => v.toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const getColor = (bg: string): Colors => {
  const index = colors.findIndex((c) => c.bg === bg);
  const color = {
    bg: colors[index].bg,
    text: colors[index].text,
    borderColor: adjustColor(colors[index].bg || "", 20),
  };

  return color;
}

export const appColors = colors.map((c) => {
  return {
    bg: c.bg,
    text: c.text,
    borderColor: c.bg,
  };
});
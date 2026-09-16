
export function toISODate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateForDisplay(isoDate: string) {
  const parts = isoDate.split(/[-/]/);
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export const MOIS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export function formatDateStringForDisplay(isoDate: string) {
  const parts = isoDate.split(/[-/]/);
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  const monthIndex = parseInt(month, 10) - 1;
  const monthName = MOIS_FR[monthIndex] ?? month;
  return `${parseInt(day, 10)} ${monthName} ${year}`;
}

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function buildYearRange(centerYear: number, span: number) {
  const years: number[] = [];
  for (let y = centerYear - span; y <= centerYear; y++) {
    years.push(y);
  }
  return years;
}

export function formatDateLong(date: Date) {
  const isoDate = toISODate(date)
  const parts = isoDate.split(/[-/]/);
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  const monthName = MOIS_FR[parseInt(month, 10) - 1] ?? month;
  return `${parseInt(day, 10)} ${monthName} ${year}`;
}

export function formatDateHeure(date: string | Date): string {
  const d = new Date(date);

  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateRelative(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();

  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHeure = Math.floor(diffMin / 60);
  const diffJour = Math.floor(diffHeure / 24);
  const diffSemaine = Math.floor(diffJour / 7);
  const diffMois = Math.floor(diffJour / 30);
  const diffAn = Math.floor(diffJour / 365);

  if (diffSec < 60) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} minute${diffMin > 1 ? "s" : ""}`;
  if (diffHeure < 24) return `il y a ${diffHeure} heure${diffHeure > 1 ? "s" : ""}`;
  if (diffJour < 7) return `il y a ${diffJour} jour${diffJour > 1 ? "s" : ""}`;
  if (diffSemaine < 4) return `il y a ${diffSemaine} semaine${diffSemaine > 1 ? "s" : ""}`;
  if (diffMois < 12) return `il y a ${diffMois} mois`;
  return `il y a ${diffAn} an${diffAn > 1 ? "s" : ""}`;
}

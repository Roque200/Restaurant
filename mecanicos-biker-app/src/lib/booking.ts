export const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export const WEEKDAYS_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

/** Zero-padded ISO date (yyyy-mm-dd), matching the format stored in the database. */
export function isoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSunday(date: Date) {
  return date.getDay() === 0;
}

export function hoursForDate(date: Date): number[] {
  const day = date.getDay();
  if (day === 0) return [];
  if (day === 6) return [9, 10, 11, 12, 13, 14];
  return [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
}

export function formatHour(hour: number) {
  return `${hour < 10 ? "0" + hour : hour}:00`;
}

export function formatLongDate(date: Date) {
  const dayName = WEEKDAYS_ES[date.getDay()];
  return `${dayName} ${date.getDate()} de ${MONTHS_ES[date.getMonth()]} de ${date.getFullYear()}`;
}

export function formatSelectionSummary(date: Date, hour: number) {
  const dayName = WEEKDAYS_ES[date.getDay()];
  const capitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  return `${capitalized} ${date.getDate()} de ${MONTHS_ES[date.getMonth()]}, ${formatHour(hour)} hrs`;
}

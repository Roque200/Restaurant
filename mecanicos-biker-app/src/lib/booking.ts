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

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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

/** Deterministic pseudo-random "occupied" simulation — stable per date+hour, not truly random. */
export function isHourBusy(date: Date, hour: number) {
  const seed = hashString(`${dateKey(date)}-${hour}`);
  return seed % 100 < 32;
}

export function dayHasFreeSlot(date: Date, today: Date) {
  const hours = hoursForDate(date);
  if (hours.length === 0) return false;
  const isToday = date.getTime() === today.getTime();
  const nowHour = new Date().getHours();
  return hours.some((h) => {
    if (isToday && h <= nowHour) return false;
    return !isHourBusy(date, h);
  });
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

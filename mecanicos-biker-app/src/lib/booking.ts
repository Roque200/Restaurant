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

export type WeeklyDaySchedule = {
  dayOfWeek: number; // 0 = domingo ... 6 = sábado
  isOpen: boolean;
  openHour: number;
  closeHour: number; // última hora en la que se puede agendar (no la hora de cierre del local)
};

export type ScheduleOverride = {
  date: string; // yyyy-mm-dd
  closed: boolean;
  openHour: number | null;
  closeHour: number | null;
  note: string | null;
};

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

function hourRange(open: number, close: number): number[] {
  const hours: number[] = [];
  for (let h = open; h <= close; h++) hours.push(h);
  return hours;
}

/**
 * Horas agendables para una fecha, según el horario semanal configurado por
 * el administrador y cualquier excepción para ese día en particular. La
 * misma función corre en el calendario del cliente y en la validación del
 * servidor, para que nunca queden desincronizados.
 */
export function computeHoursForDate(
  date: Date,
  weekly: WeeklyDaySchedule[],
  overrides: Record<string, ScheduleOverride>,
): number[] {
  const override = overrides[isoDate(date)];
  const day = weekly.find((w) => w.dayOfWeek === date.getDay());
  if (override) {
    if (override.closed) return [];
    const open = override.openHour ?? day?.openHour;
    const close = override.closeHour ?? day?.closeHour;
    if (open == null || close == null || open > close) return [];
    return hourRange(open, close);
  }
  if (!day || !day.isOpen || day.openHour > day.closeHour) return [];
  return hourRange(day.openHour, day.closeHour);
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

"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  MONTHS_ES,
  WEEKDAYS_ES,
  dayHasFreeSlot,
  formatHour,
  formatLongDate,
  formatSelectionSummary,
  hoursForDate,
  isHourBusy,
  isSunday,
  startOfDay,
} from "@/lib/booking";
import { waLink } from "@/lib/whatsapp";
import { Reveal } from "./Reveal";

const SERVICES = [
  "Servicio de suspensión",
  "Frenos hidráulicos",
  "Transmisión",
  "Afinación general",
  "Diagnóstico",
];

export function Booking() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const minMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);
  const maxMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth() + 1, 1), [today]);

  const [viewMonth, setViewMonth] = useState(minMonth);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const days = useMemo(() => {
    const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
    }
    return cells;
  }, [viewMonth]);

  const slots = selectedDate ? hoursForDate(selectedDate) : [];
  const isSelectedToday = selectedDate?.getTime() === today.getTime();
  const nowHour = new Date().getHours();

  function selectDate(date: Date) {
    setSelectedDate(date);
    setSelectedHour(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedDate || selectedHour === null || !formRef.current) return;

    const form = formRef.current;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nombre = (form.elements.namedItem("nombre") as HTMLInputElement).value.trim();
    const telefono = (form.elements.namedItem("telefono") as HTMLInputElement).value.trim();
    const servicio = (form.elements.namedItem("servicio") as HTMLSelectElement).value;

    const message =
      "Hola, quiero agendar una cita:\n" +
      `- Nombre: ${nombre}\n` +
      `- Teléfono: ${telefono}\n` +
      `- Servicio: ${servicio}\n` +
      `- Fecha: ${formatLongDate(selectedDate)}\n` +
      `- Hora: ${formatHour(selectedHour)} hrs`;

    window.open(waLink(message), "_blank", "noopener");
  }

  const canGoPrev = viewMonth.getTime() > minMonth.getTime();
  const canGoNext = viewMonth.getTime() < maxMonth.getTime();

  return (
    <section id="contacto" className="bg-[#1d1d1f] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-accent">
            Agenda tu cita
          </p>
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            El servicio de tu bici, cuando a ti te convenga
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Elige un día y horario disponible, cuéntanos qué necesita tu bici y confirmamos por WhatsApp.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                disabled={!canGoPrev}
                onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white ring-1 ring-white/10 transition-colors enabled:hover:ring-accent disabled:opacity-30"
                aria-label="Mes anterior"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="text-[15px] font-semibold uppercase tracking-wide text-white">
                {MONTHS_ES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </span>
              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white ring-1 ring-white/10 transition-colors enabled:hover:ring-accent disabled:opacity-30"
                aria-label="Mes siguiente"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-white/40">
              {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((date, i) => {
                if (!date) return <span key={i} />;
                const closed = isSunday(date);
                const past = date.getTime() < today.getTime();
                const hasFree = !closed && !past && dayHasFreeSlot(date, today);
                const isToday = date.getTime() === today.getTime();
                const isSelected = selectedDate?.getTime() === date.getTime();
                const disabled = past || closed || !hasFree;

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => selectDate(date)}
                    className={`relative aspect-square rounded-lg text-[13px] transition-colors ${
                      isSelected
                        ? "bg-accent font-bold text-white"
                        : disabled
                          ? `text-white/25 ${!closed && !past ? "line-through" : ""}`
                          : "text-white hover:ring-1 hover:ring-accent"
                    } ${isToday && !isSelected ? "underline underline-offset-4" : ""}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-[12px] text-white/40">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" /> Disponible
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/30" /> Sin cupo
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/15" /> Cerrado
              </span>
            </div>

            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="mb-3 text-[13.5px] text-white/50">
                {selectedDate
                  ? `Horarios para el ${WEEKDAYS_ES[selectedDate.getDay()]} ${selectedDate.getDate()} de ${MONTHS_ES[selectedDate.getMonth()]}`
                  : "Elige primero una fecha"}
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                <AnimatePresence mode="wait">
                  {selectedDate && (
                    <motion.div
                      key={selectedDate.toISOString()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="col-span-full grid grid-cols-3 gap-2 sm:grid-cols-4"
                    >
                      {slots.map((hour) => {
                        const pastHour = isSelectedToday && hour <= nowHour;
                        const busy = pastHour || isHourBusy(selectedDate, hour);
                        const isSelected = selectedHour === hour;
                        return (
                          <button
                            key={hour}
                            type="button"
                            disabled={busy}
                            onClick={() => setSelectedHour(hour)}
                            className={`h-10 rounded-lg text-[13px] font-medium transition-colors ${
                              isSelected
                                ? "bg-accent text-white"
                                : busy
                                  ? "text-white/25 line-through"
                                  : "text-white ring-1 ring-white/10 hover:ring-accent"
                            }`}
                          >
                            {formatHour(hour)}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex h-full flex-col gap-4 rounded-3xl bg-white p-6 sm:p-8"
            >
              <div className="flex items-center gap-2.5 rounded-xl bg-accent/10 px-4 py-3 text-[13.5px] font-medium text-accent-dark">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" className="shrink-0">
                  <path d="M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  {selectedDate && selectedHour !== null
                    ? formatSelectionSummary(selectedDate, selectedHour)
                    : selectedDate
                      ? "Elige un horario disponible"
                      : "Sin fecha ni horario seleccionados"}
                </span>
              </div>

              <label className="flex flex-col gap-1.5 text-[13px] font-medium text-muted">
                Nombre
                <input
                  name="nombre"
                  type="text"
                  required
                  placeholder="Tu nombre"
                  autoComplete="name"
                  className="h-11 rounded-xl border border-black/10 px-3.5 text-[14.5px] text-[#1d1d1f] outline-none transition-colors focus:border-accent"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-[13px] font-medium text-muted">
                Teléfono
                <input
                  name="telefono"
                  type="tel"
                  required
                  placeholder="10 dígitos"
                  autoComplete="tel"
                  className="h-11 rounded-xl border border-black/10 px-3.5 text-[14.5px] text-[#1d1d1f] outline-none transition-colors focus:border-accent"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-[13px] font-medium text-muted">
                Servicio de interés
                <select
                  name="servicio"
                  className="h-11 rounded-xl border border-black/10 px-3.5 text-[14.5px] text-[#1d1d1f] outline-none transition-colors focus:border-accent"
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                disabled={!selectedDate || selectedHour === null}
                className="mt-2 flex h-12 items-center justify-center rounded-full bg-accent text-[15px] font-semibold text-white transition-transform enabled:hover:scale-[1.02] enabled:active:scale-[0.98] disabled:opacity-40"
              >
                Confirmar cita por WhatsApp
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

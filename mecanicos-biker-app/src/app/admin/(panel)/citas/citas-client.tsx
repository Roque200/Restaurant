"use client";

import { useMemo, useState, useTransition } from "react";
import { APPOINTMENT_STATUS_LABEL, type Appointment, type AppointmentStatus } from "@/lib/admin-data";
import { AppointmentStatusBadge } from "@/components/admin/StatusBadge";
import { updateAppointmentStatus } from "@/lib/actions/appointments";

const FILTERS: { value: AppointmentStatus | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "en_proceso", label: "En proceso" },
  { value: "completada", label: "Completada" },
  { value: "cancelada", label: "Cancelada" },
];

const STATUS_OPTIONS: AppointmentStatus[] = ["pendiente", "confirmada", "en_proceso", "completada", "cancelada"];

export function CitasClient({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [filter, setFilter] = useState<AppointmentStatus | "todas">("todas");
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();

  const visible = useMemo(() => {
    return appointments
      .filter((a) => filter === "todas" || a.status === filter)
      .filter((a) => a.customer.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (a.date + a.hour).localeCompare(b.date + b.hour));
  }, [appointments, filter, query]);

  function updateStatus(id: string, status: AppointmentStatus) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    startTransition(() => {
      updateAppointmentStatus(id, status);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`h-8 rounded-full px-3.5 text-[13px] font-medium transition-colors ${
                filter === f.value ? "bg-[#1d1d1f] text-white" : "bg-white text-muted hover:text-[#1d1d1f]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar cliente…"
          className="h-9 w-full rounded-full border border-black/10 bg-white px-4 text-[13.5px] outline-none focus:border-accent sm:w-56"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full min-w-[760px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-black/5 text-[12px] uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-semibold">Cliente</th>
              <th className="px-5 py-3 font-semibold">Servicio</th>
              <th className="px-5 py-3 font-semibold">Fecha</th>
              <th className="px-5 py-3 font-semibold">Hora</th>
              <th className="px-5 py-3 font-semibold">Recibido</th>
              <th className="px-5 py-3 font-semibold">Estado</th>
              <th className="px-5 py-3 font-semibold">Actualizar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {visible.map((a) => (
              <tr key={a.id} className="transition-colors hover:bg-surface/60">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-[#1d1d1f]">{a.customer}</p>
                  <p className="text-[12px] text-muted">{a.phone}</p>
                </td>
                <td className="px-5 py-3.5 text-[#1d1d1f]/80">{a.service}</td>
                <td className="px-5 py-3.5 text-[#1d1d1f]/80">{a.date}</td>
                <td className="px-5 py-3.5 text-[#1d1d1f]/80">{a.hour}</td>
                <td className="px-5 py-3.5">
                  {a.checkedInAt ? (
                    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Sí, por QR
                    </span>
                  ) : (
                    <span className="text-[12px] text-muted">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <AppointmentStatusBadge status={a.status} label={APPOINTMENT_STATUS_LABEL[a.status]} />
                </td>
                <td className="px-5 py-3.5">
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value as AppointmentStatus)}
                    className="h-8 rounded-lg border border-black/10 bg-white px-2 text-[12.5px] outline-none focus:border-accent"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {APPOINTMENT_STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted">
                  No hay citas que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[12.5px] text-muted">
        Estas citas vienen del calendario público en tiempo real. La columna “Recibido” se marca sola cuando escaneas el
        código QR del cliente en{" "}
        <a href="/admin/escanear" className="font-semibold text-accent hover:underline">
          Escanear
        </a>
        .
      </p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { CUSTOMERS } from "@/lib/admin-data";

export default function AdminClientesPage() {
  const [query, setQuery] = useState("");

  const visible = useMemo(
    () =>
      CUSTOMERS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query)).sort(
        (a, b) => b.totalSpent - a.totalSpent,
      ),
    [query],
  );

  return (
    <div className="flex flex-col gap-5">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nombre o teléfono…"
        className="h-9 w-full max-w-xs rounded-full border border-black/10 bg-white px-4 text-[13.5px] outline-none focus:border-accent"
      />

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full min-w-[640px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-black/5 text-[12px] uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-semibold">Cliente</th>
              <th className="px-5 py-3 font-semibold">Contacto</th>
              <th className="px-5 py-3 font-semibold">Visitas</th>
              <th className="px-5 py-3 font-semibold">Total gastado</th>
              <th className="px-5 py-3 font-semibold">Última visita</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {visible.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-surface/60">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1d1d1f] text-[12px] font-semibold text-white">
                      {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                    <span className="font-medium text-[#1d1d1f]">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[#1d1d1f]/70">
                  <p>{c.phone}</p>
                  {c.email && <p className="text-[12px] text-muted">{c.email}</p>}
                </td>
                <td className="px-5 py-3.5 text-[#1d1d1f]/70">{c.visits}</td>
                <td className="px-5 py-3.5 font-medium text-[#1d1d1f]">
                  ${c.totalSpent.toLocaleString("es-MX")} MXN
                </td>
                <td className="px-5 py-3.5 text-[#1d1d1f]/70">{c.lastVisit}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

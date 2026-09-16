"use client";

import { useMemo, useState, useTransition } from "react";
import { REWARD_THRESHOLD, getRewardTier, type Customer } from "@/lib/admin-data";
import { redeemReward } from "@/lib/actions/customers";

const TIER_STYLE: Record<string, string> = {
  Bronce: "bg-orange-50 text-orange-700",
  Plata: "bg-slate-100 text-slate-600",
  Oro: "bg-amber-50 text-amber-700",
};

export function ClientesClient({ customers: initialCustomers }: { customers: Customer[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState("");
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const visible = useMemo(
    () =>
      customers
        .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query))
        .sort((a, b) => b.totalSpent - a.totalSpent),
    [customers, query],
  );

  function handleRedeem(customerId: string) {
    setRedeemingId(customerId);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, rewardPoints: c.rewardPoints - REWARD_THRESHOLD, rewardsRedeemed: c.rewardsRedeemed + 1 }
          : c,
      ),
    );
    startTransition(async () => {
      await redeemReward(customerId);
      setRedeemingId(null);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o teléfono…"
          className="h-9 w-full max-w-xs rounded-full border border-black/10 bg-white px-4 text-[13.5px] outline-none focus:border-accent"
        />
        <p className="text-[12.5px] text-muted">
          1 punto por cada servicio completado · cada {REWARD_THRESHOLD} puntos = 1 recompensa canjeable
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full min-w-[860px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-black/5 text-[12px] uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-semibold">Cliente</th>
              <th className="px-5 py-3 font-semibold">Contacto</th>
              <th className="px-5 py-3 font-semibold">Visitas</th>
              <th className="px-5 py-3 font-semibold">Total gastado</th>
              <th className="px-5 py-3 font-semibold">Nivel</th>
              <th className="px-5 py-3 font-semibold">Recompensas</th>
              <th className="px-5 py-3 font-semibold">Última visita</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {visible.map((c) => {
              const tier = getRewardTier(c.rewardLifetime);
              const progress = Math.min(c.rewardPoints, REWARD_THRESHOLD);
              const canRedeem = c.rewardPoints >= REWARD_THRESHOLD;
              return (
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
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${TIER_STYLE[tier.label]}`}>
                      {tier.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-black/10">
                          <div
                            className="h-full rounded-full bg-accent transition-all"
                            style={{ width: `${(progress / REWARD_THRESHOLD) * 100}%` }}
                          />
                        </div>
                        <span className="text-[12px] text-muted">
                          {progress}/{REWARD_THRESHOLD}
                        </span>
                      </div>
                      {canRedeem ? (
                        <button
                          onClick={() => handleRedeem(c.id)}
                          disabled={redeemingId === c.id}
                          className="w-fit rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                        >
                          Canjear recompensa
                        </button>
                      ) : c.rewardsRedeemed > 0 ? (
                        <span className="text-[11px] text-muted">{c.rewardsRedeemed} canjeadas</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#1d1d1f]/70">{c.lastVisit}</td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted">
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

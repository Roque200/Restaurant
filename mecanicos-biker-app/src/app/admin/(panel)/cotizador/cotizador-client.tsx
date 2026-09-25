"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/admin-data";
import { formatMoney, waLink } from "@/lib/whatsapp";

type QuoteItem = { id: string; name: string; price: number; qty: number; custom: boolean };

export function CotizadorClient({ products }: { products: Product[] }) {
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [productToAdd, setProductToAdd] = useState("");

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);

  function addFromCatalog() {
    const product = products.find((p) => p.id === productToAdd);
    if (!product) return;
    setItems((prev) => [...prev, { id: crypto.randomUUID(), name: product.name, price: product.price, qty: 1, custom: false }]);
    setProductToAdd("");
  }

  function addCustomItem() {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), name: "", price: 0, qty: 1, custom: true }]);
  }

  function updateItem(id: string, patch: Partial<QuoteItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function sendQuote() {
    const lines = items
      .filter((i) => i.name.trim())
      .map((i) => `- ${i.qty} x ${i.name} (${formatMoney(i.price)} c/u) = ${formatMoney(i.price * i.qty)}`);
    const message =
      `Hola${customer.trim() ? " " + customer.trim() : ""}, esta es tu cotización:\n` +
      lines.join("\n") +
      `\nTotal: ${formatMoney(total)}`;
    window.open(waLink(message), "_blank", "noopener");
  }

  const canSend = items.some((i) => i.name.trim() && i.qty > 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-black/5 bg-white p-6">
        <p className="mb-4 text-[12.5px] text-muted">
          Arma una cotización de piezas del catálogo o de conceptos libres (piezas o trabajos que no están en
          inventario) y envíasela al cliente por WhatsApp. No se guarda en el sistema.
        </p>

        <label className="mb-4 flex max-w-sm flex-col gap-1.5 text-[13px] font-medium text-muted">
          Nombre del cliente (opcional)
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Para personalizar el mensaje"
            className="h-10 rounded-xl border border-black/10 px-3 text-[14px] text-[#1d1d1f] outline-none focus:border-accent"
          />
        </label>

        <div className="mb-5 flex flex-wrap items-end gap-2">
          <label className="flex flex-1 min-w-[220px] flex-col gap-1.5 text-[12.5px] font-medium text-muted">
            Pieza del catálogo
            <select
              value={productToAdd}
              onChange={(e) => setProductToAdd(e.target.value)}
              className="h-10 rounded-xl border border-black/10 px-3 text-[14px] text-[#1d1d1f] outline-none focus:border-accent"
            >
              <option value="">Selecciona una pieza…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ${p.price.toLocaleString("es-MX")}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={addFromCatalog}
            disabled={!productToAdd}
            className="h-10 shrink-0 rounded-full border border-black/10 px-4 text-[13px] font-semibold text-[#1d1d1f] hover:bg-black/5 disabled:opacity-40"
          >
            Agregar
          </button>
          <button
            type="button"
            onClick={addCustomItem}
            className="h-10 shrink-0 rounded-full bg-[#1d1d1f] px-4 text-[13px] font-semibold text-white hover:opacity-90"
          >
            + Pieza personalizada
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {items.length === 0 && <p className="py-6 text-center text-[13px] text-muted">Aún no has agregado piezas.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-black/5 p-3">
              {item.custom ? (
                <input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  placeholder="Nombre de la pieza o trabajo"
                  className="h-9 min-w-[160px] flex-1 rounded-lg border border-black/10 px-2.5 text-[13.5px] outline-none focus:border-accent"
                />
              ) : (
                <span className="min-w-[160px] flex-1 text-[13.5px] font-medium text-[#1d1d1f]">{item.name}</span>
              )}
              <input
                type="number"
                min="1"
                value={item.qty}
                onChange={(e) => updateItem(item.id, { qty: Math.max(1, Number(e.target.value) || 1) })}
                className="h-9 w-16 rounded-lg border border-black/10 px-2 text-center text-[13.5px] outline-none focus:border-accent"
              />
              <span className="text-[13px] text-muted">×</span>
              <input
                type="number"
                min="0"
                value={item.price}
                onChange={(e) => updateItem(item.id, { price: Math.max(0, Number(e.target.value) || 0) })}
                className="h-9 w-24 rounded-lg border border-black/10 px-2 text-[13.5px] outline-none focus:border-accent"
              />
              <span className="w-24 text-right text-[13.5px] font-semibold text-[#1d1d1f]">
                ${(item.price * item.qty).toLocaleString("es-MX")}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-red-50 hover:text-red-600"
                aria-label={`Quitar ${item.name || "concepto"}`}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
          <span className="text-[15px] font-semibold text-[#1d1d1f]">Total: ${total.toLocaleString("es-MX")} MXN</span>
          <button
            onClick={sendQuote}
            disabled={!canSend}
            className="flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[14px] font-semibold text-white transition-transform enabled:hover:scale-[1.02] disabled:opacity-40"
          >
            Enviar cotización por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

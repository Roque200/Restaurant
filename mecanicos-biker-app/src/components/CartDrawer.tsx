"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/lib/cart-context";
import { formatMoney, waLink } from "@/lib/whatsapp";

export function CartDrawer() {
  const cart = useCart();

  const message =
    cart.items.length === 0
      ? ""
      : "Hola, quiero pedir:\n" +
        cart.items.map((item) => `- ${item.qty} x ${item.name} (${formatMoney(item.price)} c/u)`).join("\n") +
        `\nSubtotal: ${formatMoney(cart.total)}`;

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cart.close}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="fixed right-0 top-0 z-[101] flex h-full w-full max-w-sm flex-col bg-white shadow-2xl"
            aria-label="Carrito de productos"
          >
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
              <h2 className="text-lg font-semibold text-[#1d1d1f]">Tu carrito</h2>
              <button
                onClick={cart.close}
                aria-label="Cerrar carrito"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#1d1d1f]/60 hover:bg-black/5"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.items.length === 0 ? (
                <p className="pt-8 text-center text-[14px] text-muted">Aún no has agregado productos.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {cart.items.map((item) => (
                      <motion.li
                        key={item.name}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-black/5 p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-semibold text-[#1d1d1f]">{item.name}</p>
                          <p className="text-[12.5px] text-muted">{formatMoney(item.price)}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            onClick={() => cart.changeQty(item.name, -1)}
                            aria-label={`Quitar uno de ${item.name}`}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-[#1d1d1f] hover:bg-black/5"
                          >
                            &minus;
                          </button>
                          <span className="w-4 text-center text-[13px] font-medium">{item.qty}</span>
                          <button
                            onClick={() => cart.changeQty(item.name, 1)}
                            aria-label={`Agregar uno de ${item.name}`}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-[#1d1d1f] hover:bg-black/5"
                          >
                            +
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className="border-t border-black/5 px-6 py-5">
              <div className="mb-3 flex items-center justify-between text-[15px]">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold text-[#1d1d1f]">{formatMoney(cart.total)}</span>
              </div>
              <a
                href={cart.items.length > 0 ? waLink(message) : undefined}
                target="_blank"
                rel="noopener"
                aria-disabled={cart.items.length === 0}
                className={`flex h-12 items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white transition-transform ${
                  cart.items.length === 0
                    ? "pointer-events-none bg-black/20"
                    : "bg-accent hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.6 14.3c-.2.6-1.3 1.2-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.6-.6-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.2.3-.3.5l-.5.5c-.2.2-.3.4-.1.7.2.3.7 1.2 1.6 1.9 1.1.9 2 1.2 2.3 1.4.3.1.5.1.6-.1.2-.2.6-.7.8-1 .2-.2.4-.2.6-.1l1.7.8c.2.1.4.2.4.4.1.2.1.7-.1 1.3z" />
                </svg>
                Pedir por WhatsApp
              </a>
              <p className="mt-2.5 text-center text-[12px] text-muted">
                Confirmamos disponibilidad y forma de pago por WhatsApp.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

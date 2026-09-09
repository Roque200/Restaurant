"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/whatsapp";

type Category = "todos" | "componentes" | "accesorios" | "cuidado" | "herramientas";

const FILTERS: { value: Category; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "componentes", label: "Componentes" },
  { value: "accesorios", label: "Accesorios" },
  { value: "cuidado", label: "Cuidado" },
  { value: "herramientas", label: "Herramientas" },
];

const PRODUCTS: {
  name: string;
  category: Exclude<Category, "todos">;
  price: number;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    name: "Casco MTB ProShield",
    category: "accesorios",
    price: 890,
    desc: "Ajuste giratorio, ventilación de 18 puertos y certificación de impacto.",
    icon: (
      <>
        <path d="M4 15c0-4.4 3.6-8 8-8s8 3.6 8 8v1H4v-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M4 16h16M8 16v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: "Guantes ReinforceGrip",
    category: "accesorios",
    price: 350,
    desc: "Palma reforzada anti-vibración, dedos táctiles para pantalla.",
    icon: <path d="M6 10V6a2 2 0 1 1 4 0v4M10 8V5a2 2 0 1 1 4 0v5M14 9V6a2 2 0 1 1 4 0v6a6 6 0 0 1-6 6H9a5 5 0 0 1-5-5v-2a2 2 0 0 1 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    name: 'Cámara MTB 29"',
    category: "componentes",
    price: 180,
    desc: "Butilo estándar, válvula Presta 48mm, compatible rodada 29.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="1.5" width="2" height="3" rx="1" fill="currentColor" />
      </>
    ),
  },
  {
    name: "Llanta Tubeless 29x2.3",
    category: "componentes",
    price: 1190,
    desc: "Compuesto de baja resistencia a la rodadura, refuerzo anti-ponchaduras.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3v2M12 19v2M21 12h-2M5 12H3M18.4 5.6l-1.4 1.4M7 16l-1.4 1.4M18.4 18.4L17 17M7 8 5.6 6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: "Cadena 12 velocidades",
    category: "componentes",
    price: 650,
    desc: "Recubrimiento anticorrosivo, compatible con la mayoría de grupos 12V.",
    icon: (
      <>
        <rect x="2.5" y="9" width="8" height="6" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13.5" y="9" width="8" height="6" rx="3" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    name: "Pastillas de freno semi-metálicas",
    category: "componentes",
    price: 280,
    desc: "Mayor mordida en mojado, compatibles con las principales marcas.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="6" r="0.9" fill="currentColor" />
        <circle cx="12" cy="18" r="0.9" fill="currentColor" />
        <circle cx="6" cy="12" r="0.9" fill="currentColor" />
        <circle cx="18" cy="12" r="0.9" fill="currentColor" />
      </>
    ),
  },
  {
    name: "Lubricante de cadena (cera)",
    category: "cuidado",
    price: 220,
    desc: "Fórmula en cera de baja adherencia al polvo, para clima seco y mixto.",
    icon: (
      <>
        <path d="M9 3h6v3l2 2v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8l2-2V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: "Multiherramienta 16 en 1",
    category: "herramientas",
    price: 450,
    desc: "Llaves Allen, desarmadores y desmontallantas en un solo cuerpo.",
    icon: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  },
];

export function Products() {
  const [filter, setFilter] = useState<Category>("todos");
  const cart = useCart();
  const visible = filter === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
    <section id="productos" className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader
          eyebrow="Tienda"
          title="Productos en venta"
          desc="Refacciones y accesorios que también instalamos en el taller."
        />

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`relative h-9 rounded-full px-4 text-[13.5px] font-medium transition-colors ${
                filter === f.value ? "text-white" : "text-[#1d1d1f]/70 hover:text-[#1d1d1f]"
              }`}
            >
              {filter === f.value && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-[#1d1d1f]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((product) => (
              <motion.div
                key={product.name}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col rounded-3xl border border-black/5 bg-white p-6"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                    {product.icon}
                  </svg>
                </span>
                <span className="mb-1 text-[11px] font-bold uppercase tracking-wide text-accent">
                  {FILTERS.find((f) => f.value === product.category)?.label}
                </span>
                <h3 className="mb-1.5 text-[15.5px] font-semibold leading-snug text-[#1d1d1f]">
                  {product.name}
                </h3>
                <p className="mb-4 flex-1 text-[13px] leading-relaxed text-muted">{product.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-[#1d1d1f]">{formatMoney(product.price)}</span>
                  <button
                    onClick={() => cart.addItem(product.name, product.price)}
                    className="h-8 rounded-full border border-[#1d1d1f]/15 px-3.5 text-[12.5px] font-semibold text-[#1d1d1f] transition-colors hover:bg-[#1d1d1f] hover:text-white"
                  >
                    Agregar
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

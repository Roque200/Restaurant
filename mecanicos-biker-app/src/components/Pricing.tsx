"use client";

import { motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { staggerContainer, staggerItem } from "./Reveal";

const TIERS = [
  {
    name: "Básico",
    desc: "Mantenimiento preventivo de rutina.",
    price: 450,
    features: ["Ajuste de frenos y cambios", "Lubricación de transmisión", "Revisión de presión y tornillería"],
  },
  {
    name: "Completo",
    desc: "Afinación integral de 30 puntos.",
    price: 890,
    featured: true,
    features: [
      "Todo lo del paquete Básico",
      "Purgado de frenos hidráulicos",
      "Ajuste de suspensión (aire/sag)",
      "Limpieza profunda y torque",
    ],
  },
  {
    name: "Pro Suspensión",
    desc: "Reconstrucción completa de suspensión.",
    price: 1650,
    features: [
      "Desarmado total de horquilla y amortiguador",
      "Cambio de aceite y sellos originales",
      "Calibración de presión por peso/uso",
    ],
  },
];

export function Pricing() {
  return (
    <section id="paquetes" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader eyebrow="Paquetes" title="Elige el nivel de servicio" desc="Precios claros, sin sorpresas al final." />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              variants={staggerItem}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                tier.featured
                  ? "border-transparent bg-[#1d1d1f] text-white shadow-xl md:-translate-y-3"
                  : "border-black/5 bg-surface text-[#1d1d1f]"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Más popular
                </span>
              )}
              <h3 className="text-xl font-semibold">{tier.name}</h3>
              <p className={`mt-1 text-[13.5px] ${tier.featured ? "text-white/60" : "text-muted"}`}>{tier.desc}</p>
              <p className="mt-6 text-4xl font-semibold">
                ${tier.price.toLocaleString("es-MX")}
                <span className={`ml-1 text-sm font-normal ${tier.featured ? "text-white/50" : "text-muted"}`}>MXN</span>
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2 text-[13.5px] leading-relaxed">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tier.featured ? "bg-accent" : "bg-accent"}`} />
                    <span className={tier.featured ? "text-white/75" : "text-[#1d1d1f]/75"}>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contacto"
                className={`mt-8 flex h-11 items-center justify-center rounded-full text-[14px] font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                  tier.featured ? "bg-accent text-white" : "bg-[#1d1d1f] text-white"
                }`}
              >
                Elegir {tier.name.toLowerCase()}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

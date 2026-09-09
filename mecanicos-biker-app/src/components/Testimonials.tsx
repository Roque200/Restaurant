"use client";

import { motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { staggerContainer, staggerItem } from "./Reveal";

const TESTIMONIALS = [
  {
    quote:
      "Le hicieron servicio completo de suspensión a mi bici y quedó como nueva. Explicaron cada cosa que le hicieron.",
    name: "Javier Ramírez",
    role: "Cliente frecuente",
    stars: 5,
  },
  {
    quote:
      "Cotización clara desde el principio y sin sorpresas al final. Ahora es mi único taller de confianza.",
    name: "Carla Mendoza",
    role: "Ciclista de ruta y MTB",
    stars: 5,
  },
  {
    quote:
      "El servicio express en verdad cumple: dejé mi bici en la mañana y ya en la tarde estaba lista.",
    name: "Diego Herrera",
    role: "Enduro rider",
    stars: 4,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="mb-4 flex gap-0.5 text-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="15" height="15" fill="currentColor" opacity={i < count ? 1 : 0.25}>
          <path d="M10 1l2.8 5.7 6.2.9-4.5 4.4 1 6.2L10 15l-5.5 3.2 1-6.2L1 7.6l6.2-.9z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader eyebrow="Testimonios" title="Lo que dicen nuestros clientes" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.figure key={t.name} variants={staggerItem} className="flex flex-col rounded-3xl bg-white p-7">
              <Stars count={t.stars} />
              <blockquote className="flex-1 text-[15px] leading-relaxed text-[#1d1d1f]">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d1d1f] text-[13px] font-semibold text-white">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div>
                  <p className="text-[13.5px] font-semibold text-[#1d1d1f]">{t.name}</p>
                  <p className="text-[12.5px] text-muted">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

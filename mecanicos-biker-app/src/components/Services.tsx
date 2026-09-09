"use client";

import { motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { staggerContainer, staggerItem } from "./Reveal";

const SERVICES = [
  {
    title: "Servicio de suspensión",
    desc: "Mantenimiento y reconstrucción de horquillas y amortiguadores FOX, RockShox y más.",
    big: true,
    icon: (
      <path
        d="M4 20V10M4 10l4-6h8l4 6M4 10h16M20 20V10M9 20v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Frenos hidráulicos",
    desc: "Purgado, cambio de balatas y ajuste de potencia de frenado.",
    icon: <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" /></>,
  },
  {
    title: "Transmisión",
    desc: "Ajuste y cambio de cassette, cadena, desviadores y bujes.",
    icon: (
      <>
        <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 18L14 6h4M14 6l4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "Tubeless y llantas",
    desc: "Montaje tubeless, reparación de ponchaduras y balanceo de ruedas.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 4v2M12 18v2M21 12h-2M5 12H3M18.4 5.6l-1.4 1.4M7 16l-1.4 1.4M18.4 18.4L17 17M7 8 5.6 6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Afinación general",
    desc: "Revisión completa de 30 puntos: tensión, ajustes y lubricación.",
    icon: <path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21l2-7.5L2 9h7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  },
  {
    title: "Diagnóstico y presupuesto",
    desc: "Evaluación sin compromiso antes de cualquier trabajo.",
    icon: (
      <path
        d="M9 3h6l1 3.5 3 1.7.7-3.7L22 6.5l-3 2.3v3.4l3 2.3-2.3 2-.7-3.7-3 1.7L15 21H9l-1-3.5-3-1.7-.7 3.7L2 17.5l3-2.3V11.8l-3-2.3 2.3-2 .7 3.7 3-1.7z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    ),
  },
];

export function Services() {
  return (
    <section id="servicios" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader
          eyebrow="Qué hacemos"
          title="Servicios del taller"
          desc="Diagnóstico honesto y trabajo especializado en cada sistema de tu bicicleta."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <motion.div
              key={service.title}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={`rounded-3xl border border-black/5 bg-surface p-8 ${
                service.big ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-accent shadow-sm">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  {service.icon}
                </svg>
              </span>
              <h3 className="mb-1.5 text-[19px] font-semibold text-[#1d1d1f]">{service.title}</h3>
              <p className="text-[14.5px] leading-relaxed text-muted">{service.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

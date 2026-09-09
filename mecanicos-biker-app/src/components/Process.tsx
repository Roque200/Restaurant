"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SectionHeader } from "./SectionHeader";

const STEPS = [
  { n: "01", title: "Diagnóstico", desc: "Revisamos tu bici a fondo y detectamos el problema real, no solo el síntoma." },
  { n: "02", title: "Cotización", desc: "Te enviamos el presupuesto detallado antes de tocar una sola pieza." },
  { n: "03", title: "Reparación", desc: "Trabajo con refacciones originales y herramienta calibrada de marca." },
  { n: "04", title: "Prueba de rodada", desc: "Probamos cada bici en pista antes de entregarla, sin excepción." },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="proceso" className="bg-[#050505] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader
          eyebrow="Cómo trabajamos"
          title="De la entrada al taller a la prueba de rodada"
          desc="Un proceso claro para que sepas exactamente qué pasa con tu bicicleta."
          light
        />

        <div ref={ref} className="relative">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-white/10 md:block" />
          <motion.div
            style={{ scaleX: lineScale }}
            className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-accent md:block"
          />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 1, y: 24 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                  {step.n}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-white/50">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

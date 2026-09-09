"use client";

import { useState } from "react";
import { motion } from "motion/react";

export function RevenueChart({ data }: { data: number[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data);
  const width = 100;
  const height = 100;
  const barWidth = width / data.length;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-48 w-full overflow-visible">
        {data.map((value, i) => {
          const barHeight = (value / max) * height;
          const isHover = hover === i;
          return (
            <motion.rect
              key={i}
              x={i * barWidth + barWidth * 0.18}
              width={barWidth * 0.64}
              y={height - barHeight}
              initial={{ height: 0 }}
              animate={{ height: barHeight }}
              transition={{ duration: 0.5, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              rx={2}
              fill={isHover ? "var(--color-accent)" : "rgba(29,29,31,0.12)"}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            />
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -top-2 -translate-x-1/2 -translate-y-full rounded-lg bg-[#1d1d1f] px-2.5 py-1.5 text-[12px] font-semibold text-white"
          style={{ left: `${(hover + 0.5) * (100 / data.length)}%` }}
        >
          ${data[hover].toLocaleString("es-MX")}
        </div>
      )}
    </div>
  );
}

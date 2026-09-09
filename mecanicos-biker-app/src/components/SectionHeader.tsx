import { Reveal } from "./Reveal";

export function SectionHeader({
  eyebrow,
  title,
  desc,
  light,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  light?: boolean;
}) {
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center sm:mb-20">
      <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-accent">
        {eyebrow}
      </p>
      <h2
        className={`text-balance text-4xl font-semibold tracking-tight sm:text-5xl ${
          light ? "text-white" : "text-[#1d1d1f]"
        }`}
      >
        {title}
      </h2>
      {desc && (
        <p className={`mt-4 text-balance text-lg ${light ? "text-white/60" : "text-muted"}`}>{desc}</p>
      )}
    </Reveal>
  );
}

export function StatCard({
  label,
  value,
  trend,
  icon,
}: {
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            {icon}
          </svg>
        </span>
        {trend && (
          <span
            className={`text-[12px] font-semibold ${trend.positive ? "text-emerald-600" : "text-red-500"}`}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{value}</p>
      <p className="mt-0.5 text-[13px] text-muted">{label}</p>
    </div>
  );
}

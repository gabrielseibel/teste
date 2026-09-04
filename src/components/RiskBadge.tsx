interface RiskBadgeProps {
  emoji: string;
  label: string;
  colorClass: string;
  bgClass: string;
  subtitle: string;
}

export function RiskBadge({ emoji, label, colorClass, bgClass, subtitle }: RiskBadgeProps) {
  return (
    <div className={`rounded-2xl border-2 p-6 text-center sm:p-8 ${bgClass}`} role="status" aria-live="polite">
      <div className="text-4xl sm:text-5xl" aria-hidden="true">
        {emoji}
      </div>
      <h2 className={`mt-3 text-2xl font-extrabold sm:text-3xl ${colorClass}`}>{label}</h2>
      <p className="mt-2 text-base text-slate-700">{subtitle}</p>
    </div>
  );
}

import type { LucideIcon } from 'lucide-react';

export function SimpleCardList({
  title,
  items,
  icon: Icon,
  itemIcon,
  accentClass,
}: {
  title: string;
  items: string[];
  icon: LucideIcon;
  itemIcon?: string;
  accentClass: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className={`card ${accentClass}`}>
      <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900">
        <Icon className="h-5 w-5" aria-hidden="true" />
        {title}
      </h3>
      <ul className="space-y-2 text-sm text-slate-700">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            {itemIcon && <span aria-hidden="true">{itemIcon}</span>}
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

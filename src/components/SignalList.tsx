import { AlertTriangle } from 'lucide-react';

interface Signal {
  id: string;
  label: string;
  description: string;
  severity: 'alto' | 'medio' | 'baixo';
}

const SEVERITY_COLOR: Record<Signal['severity'], string> = {
  alto: 'border-red-200 bg-red-50',
  medio: 'border-orange-200 bg-orange-50',
  baixo: 'border-yellow-200 bg-yellow-50',
};

export function SignalList({ signals, title }: { signals: Signal[]; title: string }) {
  if (signals.length === 0) return null;

  return (
    <section className="card">
      <h3 className="mb-4 text-lg font-bold text-slate-900">{title}</h3>
      <ul className="grid gap-3 sm:grid-cols-2">
        {signals.map((signal) => (
          <li key={signal.id} className={`rounded-xl border p-4 ${SEVERITY_COLOR[signal.severity]}`}>
            <p className="flex items-start gap-2 font-semibold text-slate-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
              {signal.label}
            </p>
            <p className="mt-1 text-sm text-slate-600">{signal.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

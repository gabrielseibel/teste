import { Siren } from 'lucide-react';

export function EmergencyBanner({ reason, actions }: { reason?: string; actions: string[] }) {
  if (actions.length === 0) return null;

  return (
    <section
      className="card border-2 border-red-400 bg-red-50"
      role="alert"
      aria-live="assertive"
    >
      <h3 className="flex items-center gap-2 text-lg font-extrabold text-red-800">
        <Siren className="h-6 w-6" aria-hidden="true" />
        AÇÃO IMEDIATA
      </h3>
      {reason && <p className="mt-2 text-sm text-red-900">{reason}</p>}
      <ol className="mt-4 space-y-2 text-sm font-medium text-red-900">
        {actions.map((action, i) => (
          <li key={i} className="flex gap-2">
            <span className="font-bold">{i + 1}.</span> {action}
          </li>
        ))}
      </ol>
    </section>
  );
}

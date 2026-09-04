'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  '🔎 Entendendo o caso...',
  '🧠 Identificando sinais suspeitos...',
  '🌐 Verificando informações...',
  '🛡️ Avaliando riscos...',
  '📋 Preparando recomendações...',
];

export function LoadingAnalysis() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card flex flex-col items-center gap-6 py-12 text-center" role="status" aria-live="polite">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" aria-hidden="true" />
      <div>
        <p className="text-lg font-semibold text-slate-900">{STEPS[stepIndex]}</p>
        <p className="mt-1 text-sm text-slate-500">Isso costuma levar poucos segundos.</p>
      </div>
      <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
        {STEPS.map((step, i) => (
          <li
            key={step}
            className={i <= stepIndex ? 'font-medium text-brand-600' : ''}
            aria-hidden="true"
          >
            {i > 0 && <span className="mx-1">→</span>}
            {step.replace(/^\S+\s/, '')}
          </li>
        ))}
      </ol>
    </div>
  );
}

import { CONFIDENCE_LABEL } from '@/lib/utils';

export function ConfidenceIndicator({ level }: { level: 'alta' | 'media' | 'baixa' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="font-medium">Confiança da análise:</span>
      <span
        className={
          level === 'alta'
            ? 'rounded-full bg-green-100 px-3 py-1 font-semibold text-green-800'
            : level === 'media'
              ? 'rounded-full bg-yellow-100 px-3 py-1 font-semibold text-yellow-800'
              : 'rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700'
        }
      >
        {CONFIDENCE_LABEL[level]}
      </span>
      <span className="text-xs text-slate-400">(não é a probabilidade de ser golpe — veja abaixo)</span>
    </div>
  );
}

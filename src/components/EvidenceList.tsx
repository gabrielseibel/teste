import { FileSearch } from 'lucide-react';

interface EvidenceItem {
  statement: string;
  kind: 'fato_encontrado' | 'inferencia_do_sistema';
  supports: 'verdadeira' | 'falsa' | 'neutro';
}

const SUPPORTS_LABEL: Record<EvidenceItem['supports'], string> = {
  verdadeira: 'Apoia que seja verdadeira',
  falsa: 'Aponta que pode ser falsa',
  neutro: 'Neutro',
};

export function EvidenceList({ evidence }: { evidence: EvidenceItem[] }) {
  if (evidence.length === 0) return null;

  return (
    <section className="card">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <FileSearch className="h-5 w-5 text-brand-600" aria-hidden="true" />
        O que encontramos
      </h3>
      <ul className="space-y-3">
        {evidence.map((item, i) => (
          <li key={i} className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-800">{item.statement}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={
                  item.kind === 'fato_encontrado'
                    ? 'rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800'
                    : 'rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600'
                }
              >
                {item.kind === 'fato_encontrado' ? 'Fato encontrado em fonte' : 'Inferência do sistema'}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {SUPPORTS_LABEL[item.supports]}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

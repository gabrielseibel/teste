import { ExternalLink } from 'lucide-react';

interface SourceItem {
  title: string;
  url?: string;
  date?: string;
  type: string;
  relation: string;
}

const TYPE_LABEL: Record<string, string> = {
  oficial: 'Fonte oficial',
  jornalistico: 'Veículo jornalístico',
  fact_checking: 'Fact-checking',
  outra: 'Outra fonte',
};

export function SourceList({ sources }: { sources: SourceItem[] }) {
  if (sources.length === 0) {
    return (
      <section className="card">
        <h3 className="mb-2 text-lg font-bold text-slate-900">Fontes utilizadas</h3>
        <p className="text-sm text-slate-600">
          Nenhuma fonte externa foi consultada nesta análise. A conclusão foi baseada apenas no conteúdo
          enviado — considere as recomendações de &ldquo;como confirmar por conta própria&rdquo; abaixo.
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <h3 className="mb-4 text-lg font-bold text-slate-900">Fontes utilizadas</h3>
      <ul className="space-y-3">
        {sources.map((source, i) => (
          <li key={i} className="rounded-xl border border-slate-200 p-4">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {TYPE_LABEL[source.type] ?? source.type}
              </span>
              {source.date && <span className="text-xs text-slate-400">{source.date}</span>}
            </div>
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1 font-medium text-brand-700 hover:underline"
              >
                {source.title}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : (
              <p className="font-medium text-slate-800">{source.title}</p>
            )}
            <p className="mt-1 text-sm text-slate-600">{source.relation}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

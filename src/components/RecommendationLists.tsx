import { CheckCircle2, XCircle, Compass } from 'lucide-react';

export function RecommendationLists({
  doNow,
  doNotDo,
  howToVerify,
}: {
  doNow: string[];
  doNotDo: string[];
  howToVerify: string[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {doNow.length > 0 && (
        <section className="card border-green-200 bg-green-50/40">
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-green-800">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />O que fazer agora
          </h3>
          <ol className="space-y-2 text-sm text-slate-700">
            {doNow.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold text-green-700">{i + 1}.</span> {item}
              </li>
            ))}
          </ol>
        </section>
      )}

      {doNotDo.length > 0 && (
        <section className="card border-red-200 bg-red-50/40">
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-red-800">
            <XCircle className="h-5 w-5" aria-hidden="true" />O que NÃO fazer
          </h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {doNotDo.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true">🛑</span> {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {howToVerify.length > 0 && (
        <section className="card border-blue-200 bg-blue-50/40">
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-blue-800">
            <Compass className="h-5 w-5" aria-hidden="true" />
            Como confirmar por conta própria
          </h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {howToVerify.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true">✅</span> {item}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

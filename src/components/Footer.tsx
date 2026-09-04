import { LEGAL_DISCLAIMER } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500 sm:px-6">
        <p className="mb-3">{LEGAL_DISCLAIMER}</p>
        <p>
          Em casos de risco financeiro ou criminal, procure os canais oficiais adequados (seu banco, a
          plataforma envolvida, ou a autoridade competente). Se você estiver em perigo imediato, procure
          ajuda e os serviços de emergência apropriados sem demora.
        </p>
      </div>
    </footer>
  );
}

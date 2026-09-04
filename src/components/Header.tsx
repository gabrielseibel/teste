import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900 focus-visible:outline-brand-800">
          <ShieldCheck className="h-7 w-7 text-brand-600" aria-hidden="true" />
          <span>
            VERIFICA <span className="font-normal text-slate-500">— Golpes & Notícias</span>
          </span>
        </Link>
        <p className="hidden text-sm text-slate-500 sm:block">Gratuito • Sem cadastro • Análise com IA</p>
      </div>
    </header>
  );
}

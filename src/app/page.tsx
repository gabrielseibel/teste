import { AlertTriangle, Newspaper, ScanSearch, ShieldCheck, Sparkles } from 'lucide-react';
import { ModeCard } from '@/components/ModeCard';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <section className="text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Análise de risco automatizada e gratuita
        </p>
        <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
          Antes de pagar, clicar ou acreditar,
          <br className="hidden sm:block" /> verifique.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Envie uma mensagem, situação ou notícia e descubra quais sinais de golpe ou desinformação
          existem — em segundos, sem cadastro.
        </p>
      </section>

      <section className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2" aria-label="Escolha o tipo de verificação">
        <ModeCard
          href="/golpe"
          icon={AlertTriangle}
          emoji="🚨"
          title="Estão tentando me dar um golpe"
          description="Analise uma mensagem, ligação ou situação suspeita e veja o que fazer agora."
          accentClass="border-red-200 bg-red-50 text-red-900"
        />
        <ModeCard
          href="/noticia"
          icon={Newspaper}
          emoji="📰"
          title="Essa notícia é verdade?"
          description="Verifique uma notícia, mensagem de WhatsApp ou informação que você recebeu."
          accentClass="border-blue-200 bg-blue-50 text-blue-900"
        />
      </section>

      <section className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" /> Gratuito
        </span>
        <span aria-hidden="true">•</span>
        <span>Sem cadastro</span>
        <span aria-hidden="true">•</span>
        <span className="inline-flex items-center gap-1.5">
          <ScanSearch className="h-4 w-4 text-brand-600" aria-hidden="true" /> Análise automatizada
        </span>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-3">
        <HowItWorksStep
          step={1}
          title="Conte o que aconteceu"
          description='Cole a mensagem, descreva a situação ou compartilhe a notícia que você quer verificar.'
        />
        <HowItWorksStep
          step={2}
          title="Nós procuramos os sinais"
          description="Nosso sistema compara com táticas conhecidas de golpe ou de desinformação, como um scanner."
        />
        <HowItWorksStep
          step={3}
          title="Veja exatamente o que fazer"
          description="Receba uma explicação simples, com passo a passo do que fazer agora e o que evitar."
        />
      </section>
    </div>
  );
}

function HowItWorksStep({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="card">
      <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
        {step}
      </span>
      <h3 className="mb-1 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

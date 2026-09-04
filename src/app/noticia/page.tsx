'use client';

import { useCallback, useRef, useState } from 'react';
import { AlertOctagon, Compass } from 'lucide-react';
import { AnalysisForm } from '@/components/AnalysisForm';
import { LoadingAnalysis } from '@/components/LoadingAnalysis';
import { RiskBadge } from '@/components/RiskBadge';
import { ConfidenceIndicator } from '@/components/ConfidenceIndicator';
import { EvidenceList } from '@/components/EvidenceList';
import { SimpleCardList } from '@/components/SimpleCardList';
import { FollowUpQuestions } from '@/components/FollowUpQuestions';
import { SourceList } from '@/components/SourceList';
import { analyzeNewsRequest, ApiRequestError, type PreviousAnswer } from '@/lib/apiClient';
import { NEWS_CLASSIFICATION_META } from '@/lib/utils';
import type { FakeNewsAnalysisResult } from '@/features/fake-news/types';

const EXAMPLES = [
  'Recebi uma notícia no WhatsApp...',
  'Vi essa manchete nas redes sociais...',
  'Essa imagem está circulando...',
];

type Phase = 'form' | 'loading' | 'result';

export default function NoticiaAnalysisPage() {
  const [phase, setPhase] = useState<Phase>('form');
  const [result, setResult] = useState<FakeNewsAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [questionsSubmitting, setQuestionsSubmitting] = useState(false);

  const lastInputRef = useRef<{ content: string; url?: string; image?: File | null }>({ content: '' });

  const runAnalysis = useCallback(async (values: { text: string; link: string; image: File | null }) => {
    setPhase('loading');
    setError(null);
    lastInputRef.current = { content: values.text, url: values.link || undefined, image: values.image };
    try {
      const { result } = await analyzeNewsRequest({
        content: values.text,
        url: values.link || undefined,
        image: values.image,
      });
      setResult(result);
      setPhase('result');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Não foi possível concluir a análise agora.');
      setPhase('form');
    }
  }, []);

  const handleFollowUp = useCallback(async (answers: PreviousAnswer[]) => {
    setQuestionsSubmitting(true);
    try {
      const { result } = await analyzeNewsRequest({
        content: lastInputRef.current.content,
        url: lastInputRef.current.url,
        image: lastInputRef.current.image,
        previousAnswers: answers,
      });
      setResult(result);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Não foi possível atualizar a análise agora.');
    } finally {
      setQuestionsSubmitting(false);
    }
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">📰 Essa notícia é verdade?</h1>
      <p className="mt-2 text-slate-600">
        Cole a notícia, mensagem de WhatsApp, texto ou informação que você quer verificar.
      </p>

      <div className="mt-8">
        {phase === 'form' && (
          <AnalysisForm
            textLabel="O que você quer verificar?"
            textPlaceholder="Cole aqui o texto da notícia, mensagem ou informação que você recebeu."
            examples={EXAMPLES}
            linkLabel="URL da notícia (opcional)"
            linkPlaceholder="Se a notícia tem um link, cole aqui."
            submitLabel="VERIFICAR AGORA"
            onSubmit={runAnalysis}
            submitting={false}
            errorMessage={error}
          />
        )}

        {phase === 'loading' && <LoadingAnalysis />}

        {phase === 'result' && result && (
          <div className="space-y-6">
            <RiskBadge
              emoji={NEWS_CLASSIFICATION_META[result.classification].emoji}
              label={NEWS_CLASSIFICATION_META[result.classification].label}
              colorClass={NEWS_CLASSIFICATION_META[result.classification].colorClass}
              bgClass={NEWS_CLASSIFICATION_META[result.classification].bgClass}
              subtitle={result.explanation}
            />

            <ConfidenceIndicator level={result.confidence} />

            <section className="card">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Principal afirmação identificada
              </h3>
              <p className="text-base text-slate-800">{result.claim}</p>
            </section>

            <EvidenceList evidence={result.evidence} />

            <div className="grid gap-6 sm:grid-cols-2">
              <SimpleCardList
                title="Sinais de alerta encontrados"
                items={result.redFlags}
                icon={AlertOctagon}
                itemIcon="⚠️"
                accentClass="border-orange-200 bg-orange-50/40"
              />
              <SimpleCardList
                title="Como confirmar por conta própria"
                items={result.howToVerify}
                icon={Compass}
                itemIcon="✅"
                accentClass="border-blue-200 bg-blue-50/40"
              />
            </div>

            <FollowUpQuestions questions={result.questions} onSubmit={handleFollowUp} submitting={questionsSubmitting} />

            <SourceList sources={result.sources} />

            <p className="text-xs text-slate-400">{result.disclaimer}</p>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setPhase('form');
                setResult(null);
              }}
            >
              Verificar outra notícia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

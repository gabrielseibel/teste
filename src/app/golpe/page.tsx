'use client';

import { useCallback, useRef, useState } from 'react';
import { AnalysisForm } from '@/components/AnalysisForm';
import { LoadingAnalysis } from '@/components/LoadingAnalysis';
import { RiskBadge } from '@/components/RiskBadge';
import { ConfidenceIndicator } from '@/components/ConfidenceIndicator';
import { SignalList } from '@/components/SignalList';
import { RecommendationLists } from '@/components/RecommendationLists';
import { EmergencyBanner } from '@/components/EmergencyBanner';
import { FollowUpQuestions } from '@/components/FollowUpQuestions';
import { SourceList } from '@/components/SourceList';
import { analyzeScamRequest, ApiRequestError, type PreviousAnswer } from '@/lib/apiClient';
import { SCAM_RISK_META } from '@/lib/utils';
import type { ScamAnalysisResult } from '@/features/scam-analysis/types';

const EXAMPLES = [
  'Recebi uma mensagem do banco...',
  'Me ofereceram um investimento...',
  'Uma pessoa pediu um Pix...',
  'Recebi uma ligação sobre um familiar...',
];

type Phase = 'form' | 'loading' | 'result';

export default function GolpeAnalysisPage() {
  const [phase, setPhase] = useState<Phase>('form');
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [questionsSubmitting, setQuestionsSubmitting] = useState(false);

  const lastInputRef = useRef<{ narrative: string; link?: string; image?: File | null }>({ narrative: '' });

  const runAnalysis = useCallback(
    async (values: { text: string; link: string; image: File | null }) => {
      setPhase('loading');
      setError(null);
      lastInputRef.current = { narrative: values.text, link: values.link || undefined, image: values.image };
      try {
        const { result } = await analyzeScamRequest({
          narrative: values.text,
          link: values.link || undefined,
          image: values.image,
        });
        setResult(result);
        setPhase('result');
      } catch (err) {
        setError(err instanceof ApiRequestError ? err.message : 'Não foi possível concluir a análise agora.');
        setPhase('form');
      }
    },
    [],
  );

  const handleFollowUp = useCallback(async (answers: PreviousAnswer[]) => {
    setQuestionsSubmitting(true);
    try {
      const { result } = await analyzeScamRequest({
        narrative: lastInputRef.current.narrative,
        link: lastInputRef.current.link,
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
      <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
        🚨 Estão tentando me dar um golpe?
      </h1>
      <p className="mt-2 text-slate-600">
        Conte o que aconteceu. Quanto mais detalhes você fornecer, melhor poderemos analisar.
      </p>

      <div className="mt-8">
        {phase === 'form' && (
          <AnalysisForm
            textLabel="O que aconteceu?"
            textPlaceholder="Conte o que aconteceu. Quanto mais detalhes você fornecer, melhor poderemos analisar."
            examples={EXAMPLES}
            linkLabel="Link relacionado (opcional)"
            linkPlaceholder="Se houver um link relacionado, cole aqui."
            submitLabel="ANALISAR AGORA"
            onSubmit={runAnalysis}
            submitting={false}
            errorMessage={error}
          />
        )}

        {phase === 'loading' && <LoadingAnalysis />}

        {phase === 'result' && result && (
          <div className="space-y-6">
            <RiskBadge
              emoji={SCAM_RISK_META[result.risk].emoji}
              label={SCAM_RISK_META[result.risk].label}
              colorClass={SCAM_RISK_META[result.risk].colorClass}
              bgClass={SCAM_RISK_META[result.risk].bgClass}
              subtitle={result.summary}
            />

            <ConfidenceIndicator level={result.confidence} />

            <EmergencyBanner reason={result.emergency.reason} actions={result.emergency.immediateActions} />

            <SignalList signals={result.signals} title="Por que chegamos a essa conclusão?" />

            <RecommendationLists
              doNow={result.recommendations.doNow}
              doNotDo={result.recommendations.doNotDo}
              howToVerify={result.recommendations.howToVerify}
            />

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
              Analisar outra situação
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export interface FollowUpQuestionData {
  id: string;
  text: string;
  options: string[];
}

interface FollowUpQuestionsProps {
  questions: FollowUpQuestionData[];
  onSubmit: (answers: Array<{ question: string; answer: string }>) => void;
  submitting?: boolean;
}

export function FollowUpQuestions({ questions, onSubmit, submitting }: FollowUpQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (questions.length === 0) return null;

  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <section className="card border-brand-200 bg-brand-50/40">
      <h3 className="mb-1 flex items-center gap-2 text-lg font-bold text-slate-900">
        <HelpCircle className="h-5 w-5 text-brand-600" aria-hidden="true" />
        Para melhorar a análise, responda:
      </h3>
      <p className="mb-4 text-sm text-slate-600">Poucas perguntas rápidas nos ajudam a refinar o resultado.</p>

      <div className="space-y-5">
        {questions.map((question) => (
          <fieldset key={question.id}>
            <legend className="mb-2 font-medium text-slate-800">{question.text}</legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={question.text}>
              {question.options.map((option) => {
                const selected = answers[question.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                    className={
                      selected
                        ? 'rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white'
                        : 'rounded-lg border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-400'
                    }
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <button
        type="button"
        className="btn-primary mt-6 w-full sm:w-auto"
        disabled={!allAnswered || submitting}
        onClick={() =>
          onSubmit(questions.map((q) => ({ question: q.text, answer: answers[q.id] ?? '' })))
        }
      >
        {submitting ? 'Atualizando análise...' : 'Atualizar análise com essas respostas'}
      </button>
    </section>
  );
}

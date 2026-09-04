import type { ScamAnalysisResult } from '@/features/scam-analysis/types';
import type { FakeNewsAnalysisResult } from '@/features/fake-news/types';

interface ApiErrorBody {
  error?: string;
}

export class ApiRequestError extends Error {}

async function postForm<T>(url: string, form: FormData): Promise<{ result: T; meta: Record<string, unknown> }> {
  const response = await fetch(url, { method: 'POST', body: form });

  if (!response.ok) {
    let message = 'Não foi possível concluir a análise agora. Tente novamente em instantes.';
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body.error) message = body.error;
    } catch {
      // resposta sem corpo JSON — mantém mensagem padrão
    }
    throw new ApiRequestError(message);
  }

  return response.json();
}

export interface PreviousAnswer {
  question: string;
  answer: string;
}

export function analyzeScamRequest(params: {
  narrative: string;
  link?: string;
  image?: File | null;
  previousAnswers?: PreviousAnswer[];
}) {
  const form = new FormData();
  form.set('narrative', params.narrative);
  if (params.link) form.set('link', params.link);
  if (params.previousAnswers?.length) form.set('previousAnswers', JSON.stringify(params.previousAnswers));
  if (params.image) form.set('image', params.image);
  return postForm<ScamAnalysisResult>('/api/analyze/scam', form);
}

export function analyzeNewsRequest(params: {
  content: string;
  url?: string;
  image?: File | null;
  previousAnswers?: PreviousAnswer[];
}) {
  const form = new FormData();
  form.set('content', params.content);
  if (params.url) form.set('url', params.url);
  if (params.previousAnswers?.length) form.set('previousAnswers', JSON.stringify(params.previousAnswers));
  if (params.image) form.set('image', params.image);
  return postForm<FakeNewsAnalysisResult>('/api/analyze/news', form);
}

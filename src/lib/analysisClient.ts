import { analyzeScam } from '@/features/scam-analysis/analyze';
import { scamAnalysisInputSchema } from '@/features/scam-analysis/schema';
import type { ScamAnalysisResult } from '@/features/scam-analysis/types';
import { analyzeNews } from '@/features/fake-news/analyze';
import { fakeNewsAnalysisInputSchema } from '@/features/fake-news/schema';
import type { FakeNewsAnalysisResult } from '@/features/fake-news/types';
import { processImageField } from '@/services/image/processImageField';
import { LIMITS, sanitizeUserText } from '@/services/security/sanitize';

/**
 * O VERIFICA não tem backend próprio: toda a análise roda no navegador de
 * quem usa (o mesmo motor determinístico que antes rodava em rotas de API),
 * e a única chamada de rede é direta ao Supabase (dados públicos, somente
 * leitura). Este módulo substitui o antigo `apiClient.ts` — a mesma
 * sanitização, validação e tratamento de imagem que existiam nas rotas
 * `/api/analyze/*` agora acontecem aqui, antes de chamar o motor.
 */
export class AnalysisError extends Error {}

export interface PreviousAnswer {
  question: string;
  answer: string;
}

interface ProcessedImageOutcome {
  imageOcrText?: string;
  imageWarning?: string;
}

async function processImage(image: File | null | undefined): Promise<ProcessedImageOutcome> {
  if (!image) return {};

  if (image.size > LIMITS.IMAGE_MAX_BYTES) {
    throw new AnalysisError(`Imagem maior que o limite permitido (${LIMITS.IMAGE_MAX_BYTES / (1024 * 1024)}MB).`);
  }

  const processed = await processImageField(image);
  if (processed.error) throw new AnalysisError(processed.error);
  return { imageOcrText: processed.ocrText, imageWarning: processed.warning };
}

export interface AnalysisOutcome<T> {
  result: T;
  meta: { imageWarning: string | null };
}

export async function analyzeScamRequest(params: {
  narrative: string;
  link?: string;
  image?: File | null;
  previousAnswers?: PreviousAnswer[];
}): Promise<AnalysisOutcome<ScamAnalysisResult>> {
  const { text: narrative } = sanitizeUserText(params.narrative);
  const { text: link } = params.link ? sanitizeUserText(params.link, LIMITS.URL_MAX_CHARS) : { text: undefined };
  const { imageOcrText, imageWarning } = await processImage(params.image);

  const parsedInput = scamAnalysisInputSchema.safeParse({
    narrative,
    link: link || undefined,
    previousAnswers: params.previousAnswers,
  });
  if (!parsedInput.success) {
    throw new AnalysisError('Conte um pouco mais sobre a situação (mínimo de 3 caracteres) para conseguirmos analisar.');
  }

  try {
    const { result } = await analyzeScam({ ...parsedInput.data, imageOcrText });
    return { result, meta: { imageWarning: imageWarning ?? null } };
  } catch (err) {
    console.error('[analyzeScamRequest] erro inesperado', err instanceof Error ? err.message : err);
    throw new AnalysisError('Não foi possível concluir a análise agora. Tente novamente em instantes.');
  }
}

export async function analyzeNewsRequest(params: {
  content: string;
  url?: string;
  image?: File | null;
  previousAnswers?: PreviousAnswer[];
}): Promise<AnalysisOutcome<FakeNewsAnalysisResult>> {
  const { text: content } = sanitizeUserText(params.content);
  const { text: url } = params.url ? sanitizeUserText(params.url, LIMITS.URL_MAX_CHARS) : { text: undefined };
  const { imageOcrText, imageWarning } = await processImage(params.image);

  const parsedInput = fakeNewsAnalysisInputSchema.safeParse({
    content,
    url: url || undefined,
    previousAnswers: params.previousAnswers,
  });
  if (!parsedInput.success) {
    throw new AnalysisError('Cole a notícia, mensagem ou informação (mínimo de 3 caracteres) para conseguirmos analisar.');
  }

  try {
    const { result } = await analyzeNews({ ...parsedInput.data, imageOcrText });
    return { result, meta: { imageWarning: imageWarning ?? null } };
  } catch (err) {
    console.error('[analyzeNewsRequest] erro inesperado', err instanceof Error ? err.message : err);
    throw new AnalysisError('Não foi possível concluir a análise agora. Tente novamente em instantes.');
  }
}

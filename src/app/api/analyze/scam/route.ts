import { NextResponse } from 'next/server';
import { analyzeScam } from '@/features/scam-analysis/analyze';
import { scamAnalysisInputSchema } from '@/features/scam-analysis/schema';
import { processImageField } from '@/services/image/processImageField';
import { badRequest, checkRateLimit, serverError } from '@/services/security/apiGuard';
import { LIMITS, sanitizeUserText } from '@/services/security/sanitize';

export const runtime = 'nodejs';
// Nunca cachear respostas de análise — cada relato é potencialmente sensível.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request);
  if (rateLimit.blocked) return rateLimit.response!;

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/json')) {
    return badRequest('Tipo de conteúdo não suportado.');
  }

  let narrative = '';
  let link: string | undefined;
  let previousAnswersRaw: unknown;
  let imageFile: File | null = null;

  try {
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      narrative = String(form.get('narrative') ?? '');
      const linkValue = form.get('link');
      link = linkValue ? String(linkValue) : undefined;
      const answersValue = form.get('previousAnswers');
      previousAnswersRaw = answersValue ? JSON.parse(String(answersValue)) : undefined;
      const file = form.get('image');
      imageFile = file instanceof File && file.size > 0 ? file : null;
    } else {
      const json = await request.json();
      narrative = String(json.narrative ?? '');
      link = json.link ? String(json.link) : undefined;
      previousAnswersRaw = json.previousAnswers;
    }
  } catch {
    return badRequest('Não foi possível interpretar a solicitação.');
  }

  if (imageFile && imageFile.size > LIMITS.IMAGE_MAX_BYTES) {
    return badRequest(`Imagem maior que o limite permitido (${LIMITS.IMAGE_MAX_BYTES / (1024 * 1024)}MB).`);
  }

  const { text: sanitizedNarrative } = sanitizeUserText(narrative);
  const { text: sanitizedLink } = link ? sanitizeUserText(link, LIMITS.URL_MAX_CHARS) : { text: undefined };

  const parsedInput = scamAnalysisInputSchema.safeParse({
    narrative: sanitizedNarrative,
    link: sanitizedLink || undefined,
    previousAnswers: Array.isArray(previousAnswersRaw) ? previousAnswersRaw : undefined,
  });

  if (!parsedInput.success) {
    return badRequest('Conte um pouco mais sobre a situação (mínimo de 3 caracteres) para conseguirmos analisar.');
  }

  let imageOcrText: string | undefined;
  let imageWarning: string | undefined;
  if (imageFile) {
    const processed = await processImageField(imageFile);
    if (processed.error) return badRequest(processed.error);
    imageOcrText = processed.ocrText;
    imageWarning = processed.warning;
  }

  try {
    const { result } = await analyzeScam({ ...parsedInput.data, imageOcrText });
    return NextResponse.json({ result, meta: { imageWarning: imageWarning ?? null } });
  } catch (err) {
    console.error('[api/analyze/scam] erro inesperado', err instanceof Error ? err.message : err);
    return serverError();
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Método não permitido.' }, { status: 405 });
}

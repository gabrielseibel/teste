import { NextResponse } from 'next/server';
import { analyzeNews } from '@/features/fake-news/analyze';
import { fakeNewsAnalysisInputSchema } from '@/features/fake-news/schema';
import { processImageField } from '@/services/image/processImageField';
import { badRequest, checkRateLimit, serverError } from '@/services/security/apiGuard';
import { LIMITS, sanitizeUserText } from '@/services/security/sanitize';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request);
  if (rateLimit.blocked) return rateLimit.response!;

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/json')) {
    return badRequest('Tipo de conteúdo não suportado.');
  }

  let content = '';
  let url: string | undefined;
  let previousAnswersRaw: unknown;
  let imageFile: File | null = null;

  try {
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      content = String(form.get('content') ?? '');
      const urlValue = form.get('url');
      url = urlValue ? String(urlValue) : undefined;
      const answersValue = form.get('previousAnswers');
      previousAnswersRaw = answersValue ? JSON.parse(String(answersValue)) : undefined;
      const file = form.get('image');
      imageFile = file instanceof File && file.size > 0 ? file : null;
    } else {
      const json = await request.json();
      content = String(json.content ?? '');
      url = json.url ? String(json.url) : undefined;
      previousAnswersRaw = json.previousAnswers;
    }
  } catch {
    return badRequest('Não foi possível interpretar a solicitação.');
  }

  if (imageFile && imageFile.size > LIMITS.IMAGE_MAX_BYTES) {
    return badRequest(`Imagem maior que o limite permitido (${LIMITS.IMAGE_MAX_BYTES / (1024 * 1024)}MB).`);
  }

  const { text: sanitizedContent } = sanitizeUserText(content);
  const { text: sanitizedUrl } = url ? sanitizeUserText(url, LIMITS.URL_MAX_CHARS) : { text: undefined };

  const parsedInput = fakeNewsAnalysisInputSchema.safeParse({
    content: sanitizedContent,
    url: sanitizedUrl || undefined,
    previousAnswers: Array.isArray(previousAnswersRaw) ? previousAnswersRaw : undefined,
  });

  if (!parsedInput.success) {
    return badRequest('Cole a notícia, mensagem ou informação (mínimo de 3 caracteres) para conseguirmos analisar.');
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
    const { result, aiUsed, searchUsed } = await analyzeNews({ ...parsedInput.data, imageOcrText });
    return NextResponse.json({ result, meta: { aiUsed, searchUsed, imageWarning: imageWarning ?? null } });
  } catch (err) {
    console.error('[api/analyze/news] erro inesperado', err instanceof Error ? err.message : err);
    return serverError();
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Método não permitido.' }, { status: 405 });
}

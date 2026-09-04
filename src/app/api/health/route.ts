import { NextResponse } from 'next/server';
import { getAIProvider } from '@/services/ai';
import { getSearchProvider } from '@/services/search';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Endpoint de saúde/diagnóstico. Não expõe chaves nem detalhes sensíveis —
 * apenas indica se integrações estão configuradas, útil para verificar o
 * deploy sem precisar disparar uma análise real.
 */
export async function GET() {
  const aiProvider = getAIProvider();
  const searchProvider = getSearchProvider();

  return NextResponse.json({
    status: 'ok',
    aiConfigured: aiProvider !== null,
    aiProvider: aiProvider?.name ?? null,
    searchConfigured: searchProvider.name !== 'noop',
    timestamp: new Date().toISOString(),
  });
}

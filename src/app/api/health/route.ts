import { NextResponse } from 'next/server';
import { getKnowledgeProvider } from '@/services/knowledge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Endpoint de saúde/diagnóstico. Não expõe chaves nem detalhes sensíveis —
 * apenas indica qual base de conhecimento está em uso, útil para verificar
 * o deploy sem precisar disparar uma análise real.
 */
export async function GET() {
  const knowledge = getKnowledgeProvider();

  return NextResponse.json({
    status: 'ok',
    engine: 'deterministico', // nunca há chamada a IA generativa no VERIFICA
    knowledgeProvider: knowledge.name,
    supabaseConfigured: knowledge.name.includes('supabase'),
    timestamp: new Date().toISOString(),
  });
}

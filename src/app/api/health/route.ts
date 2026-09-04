import { NextResponse } from 'next/server';
import { getKnowledgeProvider } from '@/services/knowledge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Endpoint de saúde/diagnóstico. Não expõe chaves nem detalhes sensíveis —
 * apenas indica qual base de conhecimento está em uso e qual commit está
 * de fato no ar, útil para confirmar se um deploy (Netlify, Vercel etc.)
 * já pegou uma atualização, sem precisar disparar uma análise real.
 */
export async function GET() {
  const knowledge = getKnowledgeProvider();

  // Cada host injeta o SHA do commit em uma variável de ambiente diferente
  // no momento do build.
  const commit =
    process.env.COMMIT_REF || // Netlify
    process.env.VERCEL_GIT_COMMIT_SHA || // Vercel
    process.env.CF_PAGES_COMMIT_SHA || // Cloudflare Pages
    null;

  return NextResponse.json({
    status: 'ok',
    engine: 'deterministico', // nunca há chamada a IA generativa no VERIFICA
    knowledgeProvider: knowledge.name,
    supabaseConfigured: knowledge.name.includes('supabase'),
    commit: commit ? commit.slice(0, 7) : null,
    timestamp: new Date().toISOString(),
  });
}

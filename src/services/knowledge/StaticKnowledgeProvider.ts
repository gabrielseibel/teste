import type { FactCheckMatch, KnowledgeProvider, KnownDomain, ScamPatternDef } from './KnowledgeProvider';
import { FACT_CHECK_SOURCE_TITLE, STATIC_FACT_CHECKS, STATIC_KNOWN_DOMAINS, STATIC_SCAM_PATTERNS } from './staticData';
import { diceCoefficient } from './textSimilarity';

const DEFAULT_MIN_SIMILARITY = 0.2;
const DEFAULT_LIMIT = 3;

/**
 * Base de conhecimento embutida no código-fonte. Não depende de nenhuma
 * configuração externa — é o que garante que o VERIFICA funcione localmente
 * (ou em qualquer ambiente) sem exigir Supabase, IA, ou qualquer outra
 * credencial. Usada diretamente quando não há Supabase configurado, e como
 * rede de segurança quando o Supabase está configurado mas indisponível.
 */
export class StaticKnowledgeProvider implements KnowledgeProvider {
  readonly name = 'static';

  async getScamPatterns(): Promise<ScamPatternDef[]> {
    return STATIC_SCAM_PATTERNS;
  }

  async getKnownDomains(): Promise<KnownDomain[]> {
    return STATIC_KNOWN_DOMAINS;
  }

  async matchFactChecks(
    query: string,
    options?: { minSimilarity?: number; limit?: number },
  ): Promise<FactCheckMatch[]> {
    const minSimilarity = options?.minSimilarity ?? DEFAULT_MIN_SIMILARITY;
    const limit = options?.limit ?? DEFAULT_LIMIT;

    const scored = STATIC_FACT_CHECKS.map((fc) => ({
      fc,
      similarity: diceCoefficient(fc.claim, query),
    }))
      .filter((s) => s.similarity >= minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return scored.map(({ fc, similarity }) => ({
      claim: fc.claim,
      classification: fc.classification,
      explanation: fc.explanation,
      redFlags: fc.redFlags,
      howToVerify: fc.howToVerify,
      sourceTitle: FACT_CHECK_SOURCE_TITLE,
      sourceType: 'fact_checking',
      sourceDate: 'Recorrente',
      similarity,
    }));
  }
}

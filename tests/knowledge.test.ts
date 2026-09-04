import { describe, expect, it, vi } from 'vitest';
import { StaticKnowledgeProvider } from '@/services/knowledge/StaticKnowledgeProvider';
import { FallbackKnowledgeProvider } from '@/services/knowledge/FallbackKnowledgeProvider';
import type { KnowledgeProvider } from '@/services/knowledge/KnowledgeProvider';
import { diceCoefficient } from '@/services/knowledge/textSimilarity';

describe('StaticKnowledgeProvider (base de conhecimento embutida)', () => {
  const provider = new StaticKnowledgeProvider();

  it('retorna o catálogo de táticas de golpe', async () => {
    const patterns = await provider.getScamPatterns();
    expect(patterns.length).toBeGreaterThan(20);
    expect(patterns.some((p) => p.id === 'pedido_pix')).toBe(true);
  });

  it('retorna domínios oficiais de referência', async () => {
    const domains = await provider.getKnownDomains();
    expect(domains.some((d) => d.domain === 'itau.com.br')).toBe(true);
  });

  it('encontra correspondência para uma alegação conhecida por similaridade', async () => {
    const matches = await provider.matchFactChecks('o whatsapp vai cobrar agora para continuar usando', {
      minSimilarity: 0.2,
      limit: 3,
    });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]!.classification).toBe('provavelmente_falsa');
  });

  it('não retorna nada para um texto sem relação com a base', async () => {
    const matches = await provider.matchFactChecks('receita de bolo de cenoura com cobertura de chocolate', {
      minSimilarity: 0.3,
      limit: 3,
    });
    expect(matches).toHaveLength(0);
  });
});

describe('diceCoefficient (similaridade de texto por trigramas)', () => {
  it('retorna alta similaridade para textos quase idênticos', () => {
    expect(diceCoefficient('o whatsapp vai cobrar', 'o whatsapp vai cobrar mensalidade')).toBeGreaterThan(0.5);
  });

  it('retorna baixa similaridade para textos sem relação', () => {
    expect(diceCoefficient('receita de bolo', 'previsão do tempo para amanhã')).toBeLessThan(0.2);
  });
});

describe('FallbackKnowledgeProvider (resiliência a falhas)', () => {
  it('usa o provedor de fallback quando o primário falha', async () => {
    const failingPrimary: KnowledgeProvider = {
      name: 'primary-quebrado',
      getScamPatterns: vi.fn().mockRejectedValue(new Error('falha de rede simulada')),
      getKnownDomains: vi.fn().mockRejectedValue(new Error('falha de rede simulada')),
      matchFactChecks: vi.fn().mockRejectedValue(new Error('falha de rede simulada')),
    };
    const fallback = new StaticKnowledgeProvider();
    const combined = new FallbackKnowledgeProvider(failingPrimary, fallback);

    const patterns = await combined.getScamPatterns();
    expect(patterns.length).toBeGreaterThan(0);
  });

  it('usa o provedor primário quando ele funciona normalmente', async () => {
    const workingPrimary: KnowledgeProvider = {
      name: 'primary-ok',
      getScamPatterns: vi.fn().mockResolvedValue([]),
      getKnownDomains: vi.fn().mockResolvedValue([]),
      matchFactChecks: vi.fn().mockResolvedValue([]),
    };
    const fallback = new StaticKnowledgeProvider();
    const combined = new FallbackKnowledgeProvider(workingPrimary, fallback);

    await combined.getScamPatterns();
    expect(workingPrimary.getScamPatterns).toHaveBeenCalledTimes(1);
  });
});

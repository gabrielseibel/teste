import { beforeEach, describe, expect, it, vi } from 'vitest';
import { analyzeNews } from '@/features/fake-news/analyze';
import { __resetAIProviderCacheForTests } from '@/services/ai';
import { __resetSearchProviderCacheForTests } from '@/services/search';

// Sem provedor de IA nem de busca configurados no ambiente de teste, o
// pipeline usa a análise determinística de fallback. Isso é, por design,
// o comportamento honesto esperado: nunca inventar fontes ou classificar
// como verdadeira/falsa sem evidência real.
describe('analyzeNews (pipeline completo, modo determinístico sem IA/busca)', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    __resetAIProviderCacheForTests();
    __resetSearchProviderCacheForTests();
  });

  const cases: Array<{ label: string; content: string }> = [
    { label: 'notícia verdadeira (sem meios de confirmar sem IA/busca)', content: 'O Banco Central anunciou hoje uma nova taxa de juros básica após reunião do Copom.' },
    { label: 'notícia falsa (afirmação extraordinária)', content: 'Todos os brasileiros vão receber R$ 2.000 do governo a partir de amanhã, sem nenhuma condição.' },
    { label: 'notícia antiga apresentada como atual', content: 'Urgente: acabou de ser confirmado o fato que aconteceu há alguns anos, compartilhe antes que apaguem.' },
    { label: 'conteúdo fora de contexto', content: 'Essa foto mostra o que está acontecendo agora na cidade, mas parece ser de outro lugar e outra época.' },
    { label: 'manchete verdadeira com texto enganoso', content: 'Manchete: empresa anuncia resultado recorde — no texto, o resultado é na verdade um prejuízo.' },
    { label: 'sátira', content: 'Segundo o jornal satírico, um político prometeu resolver todos os problemas do país em um dia.' },
    { label: 'opinião apresentada como fato', content: 'Na minha opinião esse governo é o pior de todos os tempos, e isso é um fato inquestionável.' },
    { label: 'informação sem evidência suficiente', content: 'Alguém me contou que uma empresa vai fechar as portas, mas não tenho mais detalhes.' },
  ];

  for (const { label, content } of cases) {
    it(`nunca inventa fontes nem classifica com certeza sem evidência — caso: ${label}`, async () => {
      const { result, aiUsed } = await analyzeNews({ content });
      expect(aiUsed).toBe(false);
      expect(result.classification).toBe('nao_confirmada');
      expect(result.sources).toHaveLength(0);
      expect(result.explanation.toLowerCase()).toContain('não consegui confirmar');
    });
  }

  it('identifica linguagem sensacionalista como sinal de alerta', async () => {
    const { result } = await analyzeNews({
      content: 'URGENTE, BOMBA: a mídia esconde essa informação chocante, compartilhe antes que apaguem!',
    });
    expect(result.redFlags.length).toBeGreaterThan(0);
  });

  it('mascara e-mail e telefone do conteúdo antes de processar', async () => {
    const { result } = await analyzeNews({
      content: 'Me passaram essa notícia pelo e-mail leitor@example.com e pelo telefone (11) 91234-5678.',
    });
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('leitor@example.com');
    expect(serialized).not.toContain('91234-5678');
  });

  it('sempre inclui o aviso legal padrão', async () => {
    const { result } = await analyzeNews({ content: 'Notícia qualquer para verificação.' });
    expect(result.disclaimer).toBeTruthy();
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { analyzeNews } from '@/features/fake-news/analyze';
import { __resetKnowledgeProviderCacheForTests } from '@/services/knowledge';

// Sem SUPABASE_URL configurada no ambiente de teste, o motor usa a base
// curada de alegações conhecidas embutida no código (services/knowledge/staticData.ts).
describe('analyzeNews (pipeline completo, motor determinístico por similaridade)', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    __resetKnowledgeProviderCacheForTests();
  });

  it('reconhece uma alegação que corresponde a um boato conhecido (WhatsApp vai cobrar)', async () => {
    const { result } = await analyzeNews({
      content: 'Estão avisando no grupo da família que o WhatsApp vai começar a cobrar mensalidade agora.',
    });

    expect(result.classification).toBe('provavelmente_falsa');
    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.evidence.length).toBeGreaterThan(0);
    expect(['alta', 'media', 'baixa']).toContain(result.confidence);
  });

  it('reconhece o padrão de imagem/vídeo antigo fora de contexto', async () => {
    const { result } = await analyzeNews({
      content: 'Um vídeo de um desastre antigo está sendo compartilhado como se fosse de um acontecimento atual agora.',
    });

    expect(result.classification).toBe('enganosa_fora_de_contexto');
  });

  const semCorrespondencia: Array<{ label: string; content: string }> = [
    { label: 'notícia sem relação com a base conhecida', content: 'O time local venceu o campeonato regional de vôlei neste fim de semana.' },
    { label: 'opinião apresentada como fato', content: 'Na minha opinião esse governo é o pior de todos os tempos, e isso é um fato inquestionável.' },
    { label: 'informação sem evidência suficiente', content: 'Alguém me contou que uma empresa da região vai fechar as portas, mas não tenho mais detalhes sobre isso.' },
  ];

  for (const { label, content } of semCorrespondencia) {
    it(`classifica como não confirmada e não inventa fontes — caso: ${label}`, async () => {
      const { result } = await analyzeNews({ content });
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

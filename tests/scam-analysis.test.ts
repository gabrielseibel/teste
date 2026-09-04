import { beforeEach, describe, expect, it, vi } from 'vitest';
import { analyzeScam } from '@/features/scam-analysis/analyze';
import { __resetKnowledgeProviderCacheForTests } from '@/services/knowledge';

// Sem SUPABASE_URL configurada no ambiente de teste, o motor usa a base de
// conhecimento estática embutida — o que nos permite testar de ponta a
// ponta sem depender de rede ou credenciais.
describe('analyzeScam (pipeline completo, motor determinístico)', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    __resetKnowledgeProviderCacheForTests();
  });

  it('escala para risco alto/muito_alto quando há múltiplos sinais graves de golpe', async () => {
    const { result } = await analyzeScam({
      narrative:
        'Recebi uma ligação urgente, detectaram uma compra suspeita e pediram o código que chegou por SMS, dizendo que sua conta será bloqueada se eu não informar agora.',
    });

    expect(['alto', 'muito_alto']).toContain(result.risk);
    expect(result.signals.length).toBeGreaterThan(0);
    expect(result.disclaimer).toBeTruthy();
    expect(result.type).toBe('scam');
  });

  it('reconhece um relato narrado em discurso indireto (não só citação direta do golpista)', async () => {
    const { result } = await analyzeScam({
      narrative: 'Alguém me chamou dizendo que era do banco e precisava dos meus dados para ajustar.',
    });
    expect(['alto', 'muito_alto']).toContain(result.risk);
    expect(result.signals.map((s) => s.id)).toContain('falso_funcionario_banco');
  });

  it('ativa o modo de emergência quando a pessoa já fez o pagamento', async () => {
    const { result } = await analyzeScam({
      narrative: 'Já fiz o pix para a pessoa que se identificou como do banco, e agora estou preocupado.',
    });

    expect(result.emergency.isEmergency).toBe(true);
    expect(result.emergency.immediateActions.length).toBeGreaterThan(0);
    expect(result.emergency.immediateActions.join(' ')).toMatch(/banco/i);
  });

  it('retorna perguntas de esclarecimento quando não há sinais suficientes', async () => {
    const { result } = await analyzeScam({ narrative: 'Recebi uma mensagem estranha, não sei bem o que fazer.' });

    expect(result.risk).toBe('sem_sinais');
    expect(result.questions.length).toBeGreaterThan(0);
    expect(result.questions.length).toBeLessThanOrEqual(5);
  });

  it('nunca usa linguagem culpabilizadora ("você caiu") no resumo padrão', async () => {
    const { result } = await analyzeScam({ narrative: 'Recebi uma mensagem suspeita pedindo dinheiro.' });
    expect(result.summary.toLowerCase()).not.toContain('você caiu');
  });

  it('inclui um sinal de alerta quando o link informado é parecido com um domínio oficial', async () => {
    const { result } = await analyzeScam({
      narrative: 'Recebi um link para atualizar meus dados do banco.',
      link: 'http://itau-com-br.seguro-login.xyz/atualizar',
    });

    const descriptions = result.signals.map((s) => s.description).join(' ');
    expect(descriptions).toMatch(/domínio|link|TLD|extensão/i);
  });

  it('mascara CPF e e-mail antes de qualquer processamento (não aparecem no resumo)', async () => {
    const { result } = await analyzeScam({
      narrative: 'Meu CPF é 123.456.789-00 e meu e-mail é vitima@example.com, me pediram para confirmar via pix.',
    });
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('123.456.789-00');
    expect(serialized).not.toContain('vitima@example.com');
  });

  it('considera as respostas de perguntas de esclarecimento na nova análise', async () => {
    const { result } = await analyzeScam({
      narrative: 'Recebi uma mensagem de uma pessoa desconhecida.',
      previousAnswers: [{ question: 'Essa pessoa pediu algum pagamento?', answer: 'Sim, pediram um pix urgente' }],
    });
    // A resposta livre entra na mesma varredura de texto do relato original.
    expect(result.signals.some((s) => s.id === 'pedido_pix' || s.id === 'urgencia_artificial')).toBe(true);
  });
});

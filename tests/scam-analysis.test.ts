import { beforeEach, describe, expect, it, vi } from 'vitest';
import { analyzeScam } from '@/features/scam-analysis/analyze';
import { __resetAIProviderCacheForTests } from '@/services/ai';

// Sem ANTHROPIC_API_KEY/OPENAI_API_KEY no ambiente de teste, o sistema usa a
// análise determinística de fallback — o que nos permite testar de ponta a
// ponta sem depender de rede ou credenciais.
describe('analyzeScam (pipeline completo, modo determinístico sem IA)', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    __resetAIProviderCacheForTests();
  });

  it('escala para risco alto/muito_alto quando há múltiplos sinais graves de golpe', async () => {
    const { result, aiUsed } = await analyzeScam({
      narrative:
        'Recebi uma ligação urgente, detectaram uma compra suspeita e pediram o código que chegou por SMS, dizendo que sua conta será bloqueada se eu não informar agora.',
    });

    expect(aiUsed).toBe(false);
    expect(['alto', 'muito_alto']).toContain(result.risk);
    expect(result.signals.length).toBeGreaterThan(0);
    expect(result.disclaimer).toBeTruthy();
    expect(result.type).toBe('scam');
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
});

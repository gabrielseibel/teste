import { describe, expect, it } from 'vitest';
import { detectEmergency, scanForScamPatterns } from '@/features/scam-analysis/patterns';

function idsOf(text: string) {
  return scanForScamPatterns(text).map((p) => p.id);
}

describe('catálogo de táticas de golpe (detecção determinística)', () => {
  it('detecta falso funcionário de banco pedindo código de SMS', () => {
    const ids = idsOf('Boa tarde, sou do banco Itaú, detectamos uma compra suspeita, me envia o código que chegou no seu celular.');
    expect(ids).toContain('falso_funcionario_banco');
    expect(ids).toContain('pedido_codigo_sms');
  });

  it('detecta pedido de Pix para chave diferente (golpe de Pix)', () => {
    const ids = idsOf('O vendedor pediu para eu fazer um pix para essa chave diferente da loja.');
    expect(ids).toContain('pedido_pix');
  });

  it('detecta golpe do falso familiar', () => {
    const ids = idsOf('Recebi uma mensagem: "oi, aqui é seu filho, perdi meu celular, esse é meu novo número, preciso de dinheiro urgente".');
    expect(ids).toContain('falso_familiar');
    expect(ids).toContain('urgencia_artificial');
  });

  it('detecta falso prêmio/sorteio', () => {
    const ids = idsOf('Parabéns! Você foi sorteado e ganhou um prêmio exclusivo, clique aqui para resgatar.');
    expect(ids).toContain('premio_inesperado');
    expect(ids).toContain('link_suspeito');
  });

  it('detecta falsa oferta de emprego', () => {
    const ids = idsOf('Vaga de emprego: trabalhe de casa, renda extra garantida fazendo tarefa diária simples.');
    expect(ids).toContain('falso_emprego');
  });

  it('detecta investimento fraudulento', () => {
    const ids = idsOf('Nossa empresa oferece um investimento com retorno garantido de 20% ao mês, sem risco.');
    expect(ids).toContain('investimento_fraudulento');
  });

  it('detecta sinais de phishing (link + urgência)', () => {
    const ids = idsOf('Sua conta será bloqueada em 10 minutos. Clique aqui imediatamente para evitar o bloqueio: http://exemplo-falso.com');
    expect(ids).toContain('link_suspeito');
    expect(ids).toContain('urgencia_artificial');
    expect(ids).toContain('ameaca');
  });

  it('detecta golpe de marketplace/compra e venda', () => {
    const ids = idsOf('O comprador disse que o pagamento fora do site seria mais rápido, e pediu uma chave pix diferente.');
    expect(ids).toContain('golpe_marketplace');
  });

  it('detecta possível falso suporte técnico', () => {
    const ids = idsOf('Somos do suporte técnico da sua operadora, precisamos de acesso remoto, instale este aplicativo.');
    expect(ids).toContain('falso_suporte_tecnico');
  });

  it('detecta golpe de WhatsApp por canal não oficial', () => {
    const ids = idsOf('Uma pessoa me chamou no whatsapp dizendo ser da empresa, usando um número pessoal.');
    expect(ids).toContain('canal_nao_oficial');
  });

  it('detecta possível boleto falso', () => {
    const ids = idsOf('Segue em anexo o boleto atualizado com nova data de vencimento, por favor pague por este boleto.');
    expect(ids).toContain('boleto_falso');
  });

  it('não gera falso positivo para uma mensagem neutra e cotidiana', () => {
    const ids = idsOf('Oi, tudo bem? Vamos almoçar amanhã ao meio dia no restaurante perto do trabalho?');
    expect(ids).toHaveLength(0);
  });
});

describe('detecção de emergência (dano já ocorrido)', () => {
  it('identifica quando a pessoa já fez um Pix', () => {
    expect(detectEmergency('Já fiz o pix para a pessoa, o que eu faço agora?')).toBe(true);
  });

  it('identifica quando a pessoa já passou a senha', () => {
    expect(detectEmergency('Acho que já passei minha senha para essa pessoa sem perceber.')).toBe(true);
  });

  it('identifica quando a pessoa está sendo extorquida', () => {
    expect(detectEmergency('Estão me ameaçando e estão me extorquindo por dinheiro.')).toBe(true);
  });

  it('não marca emergência para um relato sem dano ocorrido', () => {
    expect(detectEmergency('Recebi uma mensagem suspeita, mas ainda não fiz nada.')).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { maskPii } from '@/services/security/piiMask';

describe('maskPii', () => {
  it('mascara CPF', () => {
    const { masked, found } = maskPii('Meu CPF é 123.456.789-00, pode confirmar?');
    expect(masked).not.toContain('123.456.789-00');
    expect(found).toContain('cpf');
  });

  it('mascara e-mail', () => {
    const { masked, found } = maskPii('Me chame em fulano@exemplo.com quando puder.');
    expect(masked).not.toContain('fulano@exemplo.com');
    expect(found).toContain('email');
  });

  it('mascara chave Pix em formato UUID', () => {
    const { masked, found } = maskPii('Minha chave pix é 123e4567-e89b-12d3-a456-426614174000.');
    expect(masked).not.toContain('123e4567-e89b-12d3-a456-426614174000');
    expect(found).toContain('chave_pix_aleatoria');
  });

  it('mascara número de cartão de 16 dígitos', () => {
    const { masked, found } = maskPii('O número do cartão é 4111 1111 1111 1111.');
    expect(masked).not.toContain('4111 1111 1111 1111');
    expect(found).toContain('cartao');
  });

  it('mascara um código numérico isolado (ex: código de SMS)', () => {
    const { masked, found } = maskPii('O código que recebi foi 482913.');
    expect(masked).not.toContain('482913');
    expect(found).toContain('codigo_autenticacao');
  });

  it('não altera texto sem dados sensíveis', () => {
    const { masked, found } = maskPii('Recebi uma mensagem estranha ontem à noite.');
    expect(masked).toBe('Recebi uma mensagem estranha ontem à noite.');
    expect(found).toHaveLength(0);
  });
});

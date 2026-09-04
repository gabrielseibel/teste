import { describe, expect, it } from 'vitest';
import { analyzeUrl } from '@/services/url-analysis/analyzeUrl';

describe('analyzeUrl (heurística de domínio, sem acessar a URL)', () => {
  it('marca uma URL inválida como inválida', () => {
    const analysis = analyzeUrl('isso não é uma url');
    expect(analysis.valid).toBe(false);
  });

  it('identifica domínio em Punycode', () => {
    const analysis = analyzeUrl('http://xn--itu-6ma.com/login');
    expect(analysis.isPunycode).toBe(true);
  });

  it('identifica domínio parecido (lookalike) com marca conhecida', () => {
    const analysis = analyzeUrl('https://itua.com.br/login'); // troca de letra em relação a itau.com.br
    expect(analysis.lookalikeOf).toBeDefined();
  });

  it('não marca o domínio oficial como lookalike de si mesmo', () => {
    const analysis = analyzeUrl('https://itau.com.br/login');
    expect(analysis.lookalikeOf).toBeUndefined();
  });

  it('identifica muitos subdomínios como sinal suspeito', () => {
    const analysis = analyzeUrl('https://login.seguro.conta.exemplo.com/');
    expect(analysis.warnings.length).toBeGreaterThan(0);
  });
});

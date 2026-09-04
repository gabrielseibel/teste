import { describe, expect, it } from 'vitest';
import { isSafePublicHttpUrl, sanitizeUserText, stripHtml, LIMITS } from '@/services/security/sanitize';
import { InMemoryRateLimiter } from '@/services/security/rateLimit';
import { validateImageUpload } from '@/services/image/validateUpload';
import { analyzeUrl } from '@/services/url-analysis/analyzeUrl';

// Nota sobre "prompt injection": o VERIFICA não faz nenhuma chamada a um
// modelo de IA generativa — todo o conteúdo do usuário é comparado por
// correspondência de padrões (regex) e similaridade de texto contra uma
// base de conhecimento, nunca interpretado como instrução por um LLM. Essa
// classe de vulnerabilidade (manipular um prompt de sistema) simplesmente
// não se aplica a essa arquitetura — não há prompt para injetar.

describe('proteção contra XSS / sanitização de texto', () => {
  it('remove tags <script> do texto do usuário', () => {
    const result = stripHtml('Olá <script>alert("xss")</script> mundo');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert(');
  });

  it('remove outras tags HTML', () => {
    const result = stripHtml('<img src=x onerror=alert(1)>texto');
    expect(result).not.toContain('<img');
  });

  it('trunca textos além do limite configurado', () => {
    const long = 'a'.repeat(10000);
    const { text, truncated } = sanitizeUserText(long, 100);
    expect(text.length).toBe(100);
    expect(truncated).toBe(true);
  });
});

describe('proteção contra SSRF / URLs maliciosas', () => {
  const knownDomains = ['itau.com.br', 'bradesco.com.br'];

  it('rejeita localhost', () => {
    expect(isSafePublicHttpUrl('http://localhost/admin').valid).toBe(false);
  });

  it('rejeita endereço de metadados de nuvem (169.254.169.254)', () => {
    expect(isSafePublicHttpUrl('http://169.254.169.254/latest/meta-data').valid).toBe(false);
  });

  it('rejeita IPs de rede privada', () => {
    expect(isSafePublicHttpUrl('http://192.168.0.1/').valid).toBe(false);
    expect(isSafePublicHttpUrl('http://10.0.0.5/').valid).toBe(false);
  });

  it('rejeita protocolos não http(s)', () => {
    expect(isSafePublicHttpUrl('file:///etc/passwd').valid).toBe(false);
  });

  it('aceita uma URL pública http(s) comum', () => {
    expect(isSafePublicHttpUrl('https://exemplo.com/pagina').valid).toBe(true);
  });

  it('sinaliza domínio com TLD suspeito', () => {
    const analysis = analyzeUrl('http://banco-alerta.xyz/login', knownDomains);
    expect(analysis.warnings.length).toBeGreaterThan(0);
  });

  it('sinaliza ausência de HTTPS', () => {
    const analysis = analyzeUrl('http://exemplo.com.br/login', knownDomains);
    expect(analysis.usesHttps).toBe(false);
  });
});

describe('validação de upload de imagem', () => {
  const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);

  it('aceita um PNG válido (assinatura correta)', () => {
    expect(validateImageUpload(pngHeader, 'image/png').valid).toBe(true);
  });

  it('rejeita arquivo com assinatura binária inválida (não é imagem de verdade)', () => {
    const fakeImage = new TextEncoder().encode('<?php echo "malicioso"; ?>');
    expect(validateImageUpload(fakeImage, 'image/png').valid).toBe(false);
  });

  it('rejeita arquivo maior que o limite permitido', () => {
    const huge = new Uint8Array(LIMITS.IMAGE_MAX_BYTES + 1);
    huge.set(pngHeader);
    expect(validateImageUpload(huge, 'image/png').valid).toBe(false);
  });

  it('rejeita arquivo vazio', () => {
    expect(validateImageUpload(new Uint8Array(0), 'image/png').valid).toBe(false);
  });
});

describe('rate limiting anti-abuso (anti-spam)', () => {
  it('bloqueia após exceder o limite configurado dentro da janela', () => {
    const limiter = new InMemoryRateLimiter(3, 60_000);
    const id = 'test-client-1';
    expect(limiter.check(id).allowed).toBe(true);
    expect(limiter.check(id).allowed).toBe(true);
    expect(limiter.check(id).allowed).toBe(true);
    const fourth = limiter.check(id);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
  });

  it('mantém clientes diferentes com contadores independentes', () => {
    const limiter = new InMemoryRateLimiter(1, 60_000);
    expect(limiter.check('cliente-a').allowed).toBe(true);
    expect(limiter.check('cliente-b').allowed).toBe(true);
    expect(limiter.check('cliente-a').allowed).toBe(false);
  });
});

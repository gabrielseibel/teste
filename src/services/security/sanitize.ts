/**
 * Sanitização e validação de tamanho de entradas de texto.
 *
 * A aplicação nunca renderiza HTML vindo do usuário com `dangerouslySetInnerHTML`
 * — o React já escapa texto por padrão, o que neutraliza XSS na maior parte
 * dos casos. Ainda assim, removemos ativamente marcações de script/HTML do
 * texto antes de persistir em logs ou processá-lo no motor de análise, como
 * defesa em profundidade.
 */

export const LIMITS = {
  TEXT_MAX_CHARS: 8000,
  URL_MAX_CHARS: 2048,
  ANSWERS_MAX: 5,
  IMAGE_MAX_BYTES: 5 * 1024 * 1024, // 5MB
  IMAGE_ALLOWED_MIME: ['image/png', 'image/jpeg', 'image/webp'] as const,
};

// Caracteres de controle (exceto tab, LF, CR), construídos via códigos de
// escape \\uXXXX para evitar caracteres de controle literais no código-fonte.
const CONTROL_CHARS = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g');

/** Remove tags HTML/scripts e caracteres de controle perigosos. */
export function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(CONTROL_CHARS, '')
    .trim();
}

export function truncate(input: string, maxChars: number): string {
  if (input.length <= maxChars) return input;
  return input.slice(0, maxChars);
}

export interface SanitizeTextResult {
  text: string;
  truncated: boolean;
}

export function sanitizeUserText(raw: string, maxChars = LIMITS.TEXT_MAX_CHARS): SanitizeTextResult {
  const stripped = stripHtml(raw);
  const truncated = stripped.length > maxChars;
  return { text: truncate(stripped, maxChars), truncated };
}

/** Validação simples de URL: precisa ser http(s) e não pode ser um IP privado/local (defesa contra SSRF). */
export function isSafePublicHttpUrl(rawUrl: string): { valid: boolean; reason?: string } {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { valid: false, reason: 'URL inválida.' };
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { valid: false, reason: 'Apenas links http/https são aceitos.' };
  }

  const hostname = url.hostname.toLowerCase();

  const privatePatterns = [
    /^localhost$/,
    /^127\./,
    /^0\.0\.0\.0$/,
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[0-1])\./,
    /^169\.254\./, // link-local / cloud metadata (SSRF clássico)
    /^::1$/,
    /^fc00:/,
    /^fe80:/,
  ];

  if (privatePatterns.some((p) => p.test(hostname))) {
    return { valid: false, reason: 'Endereço não permitido.' };
  }

  return { valid: true };
}

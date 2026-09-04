import { LIMITS } from '@/services/security/sanitize';

export interface UploadValidationResult {
  valid: boolean;
  reason?: string;
}

// "Magic numbers" (assinatura binária) dos formatos aceitos — validar pelos
// bytes reais do arquivo, não apenas pelo Content-Type declarado (que pode
// ser falsificado facilmente).
const SIGNATURES: Array<{ mime: (typeof LIMITS.IMAGE_ALLOWED_MIME)[number]; bytes: number[]; offset?: number }> = [
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // "RIFF"; WEBP confirmado depois via 'WEBP' em offset 8
];

function matchesSignature(bytes: Uint8Array, signatureBytes: number[], offset = 0): boolean {
  if (bytes.length < offset + signatureBytes.length) return false;
  return signatureBytes.every((b, i) => bytes[offset + i] === b);
}

function sniffMime(bytes: Uint8Array): string | null {
  for (const sig of SIGNATURES) {
    if (matchesSignature(bytes, sig.bytes, sig.offset)) {
      if (sig.mime === 'image/webp') {
        const isWebp = bytes.length > 12 && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
        if (!isWebp) continue;
      }
      return sig.mime;
    }
  }
  return null;
}

export function validateImageUpload(bytes: Uint8Array, declaredMime: string): UploadValidationResult {
  if (bytes.byteLength === 0) {
    return { valid: false, reason: 'Arquivo vazio.' };
  }
  if (bytes.byteLength > LIMITS.IMAGE_MAX_BYTES) {
    return { valid: false, reason: `Arquivo maior que o limite permitido (${LIMITS.IMAGE_MAX_BYTES / (1024 * 1024)}MB).` };
  }

  const sniffed = sniffMime(bytes);
  if (!sniffed) {
    return { valid: false, reason: 'Formato de imagem não reconhecido ou não suportado. Envie PNG, JPEG ou WEBP.' };
  }

  if (!(LIMITS.IMAGE_ALLOWED_MIME as readonly string[]).includes(sniffed)) {
    return { valid: false, reason: 'Tipo de arquivo não permitido.' };
  }

  if (declaredMime && sniffed !== declaredMime) {
    // Não bloqueia (alguns navegadores enviam Content-Type genérico), mas o
    // tipo real (sniffed) é o que prevalece para todos os fins.
  }

  return { valid: true };
}

export function sniffImageMime(bytes: Uint8Array): string | null {
  return sniffMime(bytes);
}

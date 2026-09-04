import type { z } from 'zod';

/**
 * Extrai e valida a saída estruturada de um provedor de IA contra um schema
 * Zod. Modelos por vezes envolvem o JSON em blocos de markdown (```json ... ```)
 * mesmo quando instruídos a não fazer isso — tratamos esse caso antes de
 * desistir. Se o parsing ou a validação falharem, retornamos um resultado de
 * falha explícito; o chamador deve então recorrer à análise determinística de
 * fallback, nunca repassar dados fora do contrato ao usuário.
 */
export interface ParseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function extractJsonCandidate(raw: string): string {
  const trimmed = raw.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) return fencedMatch[1].trim();

  // Fallback: pega do primeiro '{' ao último '}' — protege contra texto
  // acidental antes/depois do JSON.
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed;
}

export function parseStructuredJson<T>(raw: string, schema: z.ZodType<T>): ParseResult<T> {
  const candidate = extractJsonCandidate(raw);

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(candidate);
  } catch (err) {
    return { success: false, error: `JSON inválido: ${(err as Error).message}` };
  }

  const result = schema.safeParse(parsedJson);
  if (!result.success) {
    return { success: false, error: result.error.message };
  }

  return { success: true, data: result.data };
}

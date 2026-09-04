/**
 * Similaridade de texto por trigramas de caracteres (coeficiente de Dice),
 * usada pelo StaticKnowledgeProvider para aproximar, em JavaScript puro e
 * sem dependências, o mesmo tipo de comparação que a extensão pg_trgm faz
 * no Postgres (usada pelo SupabaseKnowledgeProvider via RPC). Não precisa
 * ser idêntica — só precisa ser uma aproximação razoável para permitir que
 * o app funcione localmente sem nenhuma configuração de banco.
 */

// Marcas diacríticas combinantes (usado para remover acentos após NFD),
// construído via código de escape para evitar caracteres combinantes
// literais no código-fonte.
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '') // remove acentos
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function trigrams(text: string): Set<string> {
  const padded = `  ${normalize(text)} `;
  const grams = new Set<string>();
  for (let i = 0; i < padded.length - 2; i++) {
    grams.add(padded.slice(i, i + 3));
  }
  return grams;
}

export function diceCoefficient(a: string, b: string): number {
  const gramsA = trigrams(a);
  const gramsB = trigrams(b);
  if (gramsA.size === 0 || gramsB.size === 0) return 0;

  let intersection = 0;
  for (const gram of gramsA) {
    if (gramsB.has(gram)) intersection++;
  }

  return (2 * intersection) / (gramsA.size + gramsB.size);
}

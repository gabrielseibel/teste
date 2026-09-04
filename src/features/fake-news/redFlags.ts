/**
 * Detecção determinística de linguagem sensacionalista — um sinal de alerta
 * adicional e independente da correspondência com a base de alegações
 * conhecidas (match_fact_checks). Não é, por si só, prova de que algo é
 * falso, apenas um indício a mais para o usuário considerar.
 */
const SENSATIONALIST_PATTERNS: RegExp[] = [
  /urgente/i,
  /bomba/i,
  /chocante/i,
  /ningu[ée]m (est[áa] )?te contando/i,
  /m[íi]dia (esconde|n[ãa]o mostra)/i,
  /compartilhe antes que apaguem/i,
  /\bganhe\b.*\bgoverno\b/i,
];

export function detectSensationalistLanguage(text: string): string[] {
  return SENSATIONALIST_PATTERNS.filter((p) => p.test(text)).map(
    (p) => `Linguagem que combina com padrão sensacionalista: "${p.source}"`,
  );
}

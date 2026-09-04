import type { ScamPatternDef } from '@/services/knowledge/KnowledgeProvider';

/**
 * Lógica de varredura determinística por palavras-chave (regex) contra o
 * catálogo de táticas de golpe. O catálogo em si (dados) vem do
 * KnowledgeProvider — Supabase por padrão, com fallback estático embutido
 * — e não mais deste arquivo, que contém apenas a lógica de correspondência,
 * reutilizável para qualquer lista de padrões.
 */

export interface DetectedPattern extends ScamPatternDef {
  matchedText: string;
}

export function scanForScamPatterns(text: string, patterns: ScamPatternDef[]): DetectedPattern[] {
  const found: DetectedPattern[] = [];
  for (const pattern of patterns) {
    for (const keywordSource of pattern.keywords) {
      let regex: RegExp;
      try {
        regex = new RegExp(keywordSource, 'i');
      } catch {
        continue; // ignora padrão malformado em vez de derrubar a análise
      }
      const match = text.match(regex);
      if (match) {
        found.push({ ...pattern, matchedText: match[0] });
        break;
      }
    }
  }
  return found;
}

const kw = (...words: string[]): RegExp[] => words.map((w) => new RegExp(w, 'i'));

/** Frases que indicam que a pessoa já sofreu algum dano — aciona o modo de emergência. */
export const EMERGENCY_KEYWORDS: RegExp[] = kw(
  'j[áa] fiz o pix',
  'j[áa] transferi',
  'j[áa] paguei',
  'j[áa] enviei o (código|dinheiro)',
  'j[áa] passei (minha |a )?senha',
  'j[áa] passei meus dados',
  'perdi acesso [àa] (minha )?conta',
  'instalei o aplicativo',
  'cliquei no link',
  'j[áa] mandei os documentos',
  'est[ãa]o me amea[çc]ando',
  'est[ãa]o me extorquindo',
);

export function detectEmergency(text: string): boolean {
  return EMERGENCY_KEYWORDS.some((r) => r.test(text));
}

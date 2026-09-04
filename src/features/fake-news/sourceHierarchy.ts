/**
 * Hierarquia de confiabilidade de fontes usada para orientar a IA e para
 * classificar/ordenar fontes retornadas pela camada de busca.
 *
 * Nível 1 — Fontes primárias/oficiais (governo, órgãos públicos, universidades,
 *           documentos oficiais, empresas envolvidas, publicações originais,
 *           tribunais, instituições reconhecidas).
 * Nível 2 — Veículos jornalísticos estabelecidos.
 * Nível 3 — Organizações especializadas em fact-checking.
 * Nível 4 — Outras fontes públicas. Redes sociais, fóruns e posts são
 *           evidência secundária, nunca prova automática.
 */

export const SOURCE_TIER_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: 'Fonte oficial/primária',
  2: 'Veículo jornalístico',
  3: 'Organização de fact-checking',
  4: 'Outra fonte pública',
};

// Domínios de referência conhecidos (não exaustivo — usado como heurística
// auxiliar, nunca como única base de decisão). Fácil de estender.
export const KNOWN_TIER1_DOMAINS = [
  'gov.br',
  'planalto.gov.br',
  'in.gov.br', // Diário Oficial da União
  'stf.jus.br',
  'stj.jus.br',
  'tse.jus.br',
  'bcb.gov.br',
  'cvm.gov.br',
  'anvisa.gov.br',
  'ibge.gov.br',
  'susep.gov.br',
];

export const KNOWN_FACT_CHECKING_DOMAINS = [
  'aosfatos.org',
  'lupa.uol.com.br',
  'agencia-lupa.com.br',
  'projetocomprova.com.br',
  'g1.globo.com/fato-ou-fake',
  'boatos.org',
  'e-farsas.com',
  'checamos.afp.com',
];

export function classifyDomainTier(hostname: string): 1 | 3 | 4 {
  const host = hostname.toLowerCase();
  if (KNOWN_TIER1_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`)) || host.endsWith('.gov.br')) {
    return 1;
  }
  if (KNOWN_FACT_CHECKING_DOMAINS.some((d) => host.includes(d))) {
    return 3;
  }
  return 4;
}

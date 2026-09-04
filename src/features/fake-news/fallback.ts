import type { FakeNewsAnalysisInput, FakeNewsAnalysisResult } from './types';

export const NEWS_DISCLAIMER =
  'Esta ferramenta fornece uma análise automatizada para ajudar na tomada de decisão. Ela não substitui orientação profissional, investigação oficial ou confirmação diretamente com a instituição envolvida.';

const SENSATIONALIST_PATTERNS: RegExp[] = [
  /urgente/i,
  /bomba/i,
  /chocante/i,
  /ningu[ée]m (est[áa] )?te contando/i,
  /m[íi]dia (esconde|n[ãa]o mostra)/i,
  /compartilhe antes que apaguem/i,
  /\bganhe\b.*\bgoverno\b/i,
];

/**
 * Análise determinística de fallback: nunca declara algo como falso ou
 * verdadeiro sem fontes — na ausência de um provedor de IA/busca configurado,
 * a resposta honesta é "não confirmada", com sinais de alerta textuais e
 * orientações de como o próprio usuário pode verificar.
 */
export function buildDeterministicNewsAnalysis(input: FakeNewsAnalysisInput): FakeNewsAnalysisResult {
  const fullText = [input.content, input.imageOcrText ?? ''].filter(Boolean).join('\n');

  const redFlags = SENSATIONALIST_PATTERNS.filter((p) => p.test(fullText)).map(
    (p) => `Linguagem que combina com padrão sensacionalista: "${p.source}"`,
  );

  return {
    type: 'misinformation',
    classification: 'nao_confirmada',
    confidence: 'baixa',
    claim: input.content.slice(0, 200),
    evidence: [],
    sources: [],
    explanation:
      'Não consegui confirmar essa informação com segurança. Nenhum provedor de IA ou pesquisa está configurado neste ambiente (ou não foi possível localizar fontes suficientes), então, para não arriscar uma conclusão sem base, classificamos como não confirmada.',
    redFlags,
    howToVerify: [
      'Procure a mesma informação em veículos jornalísticos estabelecidos e compare os textos.',
      'Verifique se órgãos oficiais relacionados ao tema (governo, empresa citada) publicaram algo a respeito.',
      'Procure a data original da informação — conteúdos antigos às vezes voltam a circular como se fossem atuais.',
      'Consulte agências de fact-checking brasileiras dedicadas a esse tipo de verificação.',
    ],
    questions: [
      {
        id: 'tem_fonte',
        text: 'Você recebeu essa informação com algum link de origem (site, veículo de notícia)?',
        options: ['Sim', 'Não', 'Não sei'],
      },
      {
        id: 'sabe_data',
        text: 'Você sabe se essa informação é recente ou pode ser antiga?',
        options: ['É recente', 'Pode ser antiga', 'Não sei'],
      },
    ],
    disclaimer: NEWS_DISCLAIMER,
  };
}

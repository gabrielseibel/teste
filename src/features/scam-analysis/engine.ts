import type { DetectedPattern } from './patterns';
import { scamAnalysisResultSchema } from './schema';
import type { ScamAnalysisResult, ScamRiskLevel, ScamSignal } from './types';

export const SCAM_DISCLAIMER =
  'Esta ferramenta fornece uma análise automatizada, baseada em um catálogo de táticas de golpe conhecidas, para ajudar na tomada de decisão. Ela não substitui orientação profissional, investigação oficial ou confirmação diretamente com a instituição envolvida.';

function riskFromSignals(signals: ScamSignal[]): ScamRiskLevel {
  const highCount = signals.filter((s) => s.severity === 'alto').length;
  const mediumCount = signals.filter((s) => s.severity === 'medio').length;

  if (highCount >= 3) return 'muito_alto';
  if (highCount >= 1 && highCount + mediumCount >= 2) return 'alto';
  if (highCount >= 1) return 'alto';
  if (mediumCount >= 2) return 'moderado';
  if (mediumCount === 1) return 'moderado';
  return 'sem_sinais';
}

/**
 * Monta a análise final a partir dos sinais já identificados pela varredura
 * determinística (features/scam-analysis/patterns.ts) contra o catálogo do
 * KnowledgeProvider. Este é o único motor de análise do VERIFICA — não há
 * nenhuma chamada a um modelo de IA generativa em nenhum ponto do sistema.
 */
export function buildScamAnalysis(matches: DetectedPattern[], isEmergency: boolean): ScamAnalysisResult {
  return scamAnalysisResultSchema.parse(buildScamAnalysisUnsafe(matches, isEmergency));
}

/** Constrói o resultado; validado contra o schema em `buildScamAnalysis` acima como rede de segurança. */
function buildScamAnalysisUnsafe(matches: DetectedPattern[], isEmergency: boolean): ScamAnalysisResult {
  const signals: ScamSignal[] = matches.map((m) => ({
    id: m.id,
    label: m.label,
    description: m.description,
    severity: m.severity,
    fromCatalog: true,
  }));

  const risk = riskFromSignals(signals);
  const confidence = signals.length >= 2 ? 'media' : 'baixa';

  const questions =
    signals.length === 0
      ? [
          {
            id: 'pediu_pagamento',
            text: 'Essa pessoa ou mensagem pediu algum tipo de pagamento (Pix, boleto, cartão)?',
            options: ['Sim', 'Não', 'Não sei'],
          },
          {
            id: 'recebeu_link',
            text: 'Você recebeu algum link para clicar?',
            options: ['Sim', 'Não', 'Não sei'],
          },
          {
            id: 'canal_contato',
            text: 'O contato aconteceu por um canal oficial da empresa/instituição (app, site, telefone confirmado)?',
            options: ['Sim', 'Não', 'Não sei'],
          },
        ]
      : [];

  return {
    type: 'scam',
    risk,
    confidence,
    summary:
      signals.length > 0
        ? `Identificamos ${signals.length} sinal(is) associados a táticas conhecidas de golpe nessa situação.`
        : 'Não identificamos, no nosso catálogo de táticas conhecidas, sinais claros de golpe nessa situação — mas isso não é uma garantia. Responda as perguntas abaixo para refinar a análise.',
    signals,
    recommendations: {
      doNow: [
        'Não faça nenhum pagamento até confirmar a situação por um canal oficial.',
        'Confirme diretamente com a empresa ou pessoa usando um número/aplicativo que você já conhece, não um contato enviado pela própria mensagem suspeita.',
      ],
      doNotDo: [
        'Não clique em links recebidos por mensagem sem confirmar o domínio.',
        'Não compartilhe códigos de verificação, senhas ou dados bancários.',
      ],
      howToVerify: [
        'Acesse o aplicativo ou site oficial digitando o endereço diretamente, sem usar o link recebido.',
        'Ligue para um telefone oficial já conhecido, e não para um número enviado na mensagem.',
      ],
    },
    emergency: {
      isEmergency,
      reason: isEmergency
        ? 'A narrativa indica que uma ação de risco já pode ter ocorrido (pagamento, compartilhamento de dados ou instalação de aplicativo).'
        : undefined,
      immediateActions: isEmergency
        ? [
            'Entre em contato imediatamente com seu banco pelos canais oficiais (aplicativo ou telefone que já está salvo) para relatar a situação e pedir orientação sobre contestação.',
            'Troque suas senhas principais (banco, e-mail, redes sociais) a partir de um dispositivo seguro.',
            'Ative a autenticação em dois fatores nas contas mais importantes.',
            'Encerre sessões ativas em aplicativos sensíveis quando essa opção estiver disponível.',
            'Preserve provas: prints da conversa, número utilizado, horários.',
            'Não continue a conversa com quem entrou em contato.',
            'Se aplicável, registre um boletim de ocorrência.',
          ]
        : [],
    },
    questions,
    sources: [],
    disclaimer: SCAM_DISCLAIMER,
  };
}

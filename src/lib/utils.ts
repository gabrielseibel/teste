import type { ScamRiskLevel } from '@/features/scam-analysis/types';
import type { NewsClassification } from '@/features/fake-news/types';

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export const SCAM_RISK_META: Record<
  ScamRiskLevel,
  { emoji: string; label: string; colorClass: string; bgClass: string }
> = {
  muito_alto: { emoji: '🔴', label: 'RISCO MUITO ALTO', colorClass: 'text-risk-critical', bgClass: 'bg-red-50 border-red-300' },
  alto: { emoji: '🟠', label: 'RISCO ALTO', colorClass: 'text-risk-high', bgClass: 'bg-orange-50 border-orange-300' },
  moderado: { emoji: '🟡', label: 'RISCO MODERADO', colorClass: 'text-risk-moderate', bgClass: 'bg-yellow-50 border-yellow-300' },
  baixo: { emoji: '🔵', label: 'RISCO BAIXO', colorClass: 'text-risk-low', bgClass: 'bg-blue-50 border-blue-300' },
  sem_sinais: { emoji: '🟢', label: 'SEM SINAIS RELEVANTES', colorClass: 'text-risk-none', bgClass: 'bg-green-50 border-green-300' },
  nao_confirmado: { emoji: '⚪', label: 'NÃO FOI POSSÍVEL CONFIRMAR', colorClass: 'text-risk-unknown', bgClass: 'bg-gray-50 border-gray-300' },
};

export const NEWS_CLASSIFICATION_META: Record<
  NewsClassification,
  { emoji: string; label: string; colorClass: string; bgClass: string }
> = {
  provavelmente_falsa: { emoji: '🔴', label: 'PROVAVELMENTE FALSA', colorClass: 'text-risk-critical', bgClass: 'bg-red-50 border-red-300' },
  enganosa_fora_de_contexto: { emoji: '🟠', label: 'ENGANOSA / FORA DE CONTEXTO', colorClass: 'text-risk-high', bgClass: 'bg-orange-50 border-orange-300' },
  nao_confirmada: { emoji: '🟡', label: 'NÃO CONFIRMADA', colorClass: 'text-risk-moderate', bgClass: 'bg-yellow-50 border-yellow-300' },
  provavelmente_verdadeira: { emoji: '🟢', label: 'PROVAVELMENTE VERDADEIRA', colorClass: 'text-risk-none', bgClass: 'bg-green-50 border-green-300' },
  confirmada_por_fontes: { emoji: '🔵', label: 'CONFIRMADA POR FONTES CONFIÁVEIS', colorClass: 'text-risk-low', bgClass: 'bg-blue-50 border-blue-300' },
};

export const CONFIDENCE_LABEL: Record<'alta' | 'media' | 'baixa', string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

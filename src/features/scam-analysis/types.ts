/**
 * Tipos do domínio "Estão tentando me dar um golpe" (Modo 1).
 */

export type ScamRiskLevel =
  | 'muito_alto'
  | 'alto'
  | 'moderado'
  | 'baixo'
  | 'sem_sinais'
  | 'nao_confirmado';

export type ConfidenceLevel = 'alta' | 'media' | 'baixa';

export type SignalSeverity = 'alto' | 'medio' | 'baixo';

export interface ScamSignal {
  /** id estável do catálogo de táticas, ex: "urgencia_artificial" */
  id: string;
  label: string;
  description: string;
  severity: SignalSeverity;
  /** true quando detectado por regra determinística (catálogo), false quando só a IA identificou */
  fromCatalog: boolean;
}

export interface FollowUpQuestion {
  id: string;
  text: string;
  options: Array<'Sim' | 'Não' | 'Não sei'> | string[];
}

export interface SourceRef {
  title: string;
  url?: string;
  type: 'oficial' | 'jornalistico' | 'fact_checking' | 'outra';
  date?: string;
  relation: string;
}

export interface ScamRecommendations {
  doNow: string[];
  doNotDo: string[];
  howToVerify: string[];
}

export interface EmergencyGuidance {
  isEmergency: boolean;
  reason?: string;
  immediateActions: string[];
}

export interface ScamAnalysisResult {
  type: 'scam';
  risk: ScamRiskLevel;
  confidence: ConfidenceLevel;
  summary: string;
  signals: ScamSignal[];
  recommendations: ScamRecommendations;
  emergency: EmergencyGuidance;
  questions: FollowUpQuestion[];
  sources: SourceRef[];
  disclaimer: string;
}

export interface ScamAnalysisInput {
  narrative: string;
  link?: string;
  previousAnswers?: Array<{ question: string; answer: string }>;
  imageOcrText?: string;
}

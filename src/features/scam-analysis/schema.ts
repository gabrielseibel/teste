import { z } from 'zod';

/**
 * Schema Zod usado para validar o resultado montado pelo motor determinístico
 * (features/scam-analysis/engine.ts) antes de ser devolvido ao usuário — uma
 * rede de segurança contra qualquer inconsistência na construção do objeto,
 * garantindo que a resposta nunca fuja do contrato esperado pelo frontend.
 */

export const scamRiskLevelSchema = z.enum([
  'muito_alto',
  'alto',
  'moderado',
  'baixo',
  'sem_sinais',
  'nao_confirmado',
]);

export const confidenceLevelSchema = z.enum(['alta', 'media', 'baixa']);

export const scamSignalSchema = z.object({
  id: z.string().min(1).max(80),
  label: z.string().min(1).max(120),
  description: z.string().min(1).max(400),
  severity: z.enum(['alto', 'medio', 'baixo']),
  fromCatalog: z.boolean(),
});

export const followUpQuestionSchema = z.object({
  id: z.string().min(1).max(80),
  text: z.string().min(1).max(200),
  options: z.array(z.string().min(1).max(30)).min(2).max(4),
});

export const sourceRefSchema = z.object({
  title: z.string().min(1).max(200),
  url: z.string().url().max(500).optional(),
  type: z.enum(['oficial', 'jornalistico', 'fact_checking', 'outra']),
  date: z.string().max(40).optional(),
  relation: z.string().min(1).max(300),
});

export const scamAnalysisResultSchema = z.object({
  type: z.literal('scam'),
  risk: scamRiskLevelSchema,
  confidence: confidenceLevelSchema,
  summary: z.string().min(1).max(600),
  signals: z.array(scamSignalSchema).max(20),
  recommendations: z.object({
    doNow: z.array(z.string().min(1).max(300)).max(10),
    doNotDo: z.array(z.string().min(1).max(300)).max(10),
    howToVerify: z.array(z.string().min(1).max(300)).max(10),
  }),
  emergency: z.object({
    isEmergency: z.boolean(),
    reason: z.string().max(300).optional(),
    immediateActions: z.array(z.string().min(1).max(300)).max(10),
  }),
  questions: z.array(followUpQuestionSchema).max(5),
  sources: z.array(sourceRefSchema).max(10),
  disclaimer: z.string().min(1).max(400),
});

export type ScamAnalysisResultParsed = z.infer<typeof scamAnalysisResultSchema>;

export const scamAnalysisInputSchema = z.object({
  narrative: z.string().min(3).max(8000),
  link: z.string().max(2048).optional(),
  previousAnswers: z
    .array(z.object({ question: z.string().max(200), answer: z.string().max(30) }))
    .max(5)
    .optional(),
  imageOcrText: z.string().max(4000).optional(),
});

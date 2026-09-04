import { z } from 'zod';

export const newsClassificationSchema = z.enum([
  'provavelmente_falsa',
  'enganosa_fora_de_contexto',
  'nao_confirmada',
  'provavelmente_verdadeira',
  'confirmada_por_fontes',
]);

export const confidenceLevelSchema = z.enum(['alta', 'media', 'baixa']);

export const evidenceItemSchema = z.object({
  statement: z.string().min(1).max(400),
  kind: z.enum(['fato_encontrado', 'inferencia_do_sistema']),
  supports: z.enum(['verdadeira', 'falsa', 'neutro']),
});

export const newsSourceRefSchema = z.object({
  title: z.string().min(1).max(200),
  url: z.string().url().max(500).optional(),
  date: z.string().max(40).optional(),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  type: z.enum(['oficial', 'jornalistico', 'fact_checking', 'outra']),
  relation: z.string().min(1).max(300),
});

export const fakeNewsAnalysisResultSchema = z.object({
  type: z.literal('misinformation'),
  classification: newsClassificationSchema,
  confidence: confidenceLevelSchema,
  claim: z.string().min(1).max(400),
  evidence: z.array(evidenceItemSchema).max(15),
  sources: z.array(newsSourceRefSchema).max(10),
  explanation: z.string().min(1).max(1200),
  redFlags: z.array(z.string().min(1).max(300)).max(10),
  howToVerify: z.array(z.string().min(1).max(300)).max(10),
  questions: z
    .array(z.object({ id: z.string().max(80), text: z.string().max(200), options: z.array(z.string().max(30)).min(2).max(4) }))
    .max(5),
  disclaimer: z.string().min(1).max(400),
});

export type FakeNewsAnalysisResultParsed = z.infer<typeof fakeNewsAnalysisResultSchema>;

export const fakeNewsAnalysisInputSchema = z.object({
  content: z.string().min(3).max(8000),
  url: z.string().max(2048).optional(),
  previousAnswers: z
    .array(z.object({ question: z.string().max(200), answer: z.string().max(30) }))
    .max(5)
    .optional(),
  imageOcrText: z.string().max(4000).optional(),
});

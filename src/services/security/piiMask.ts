/**
 * Mascaramento automático de dados pessoais sensíveis (Privacy by Design).
 *
 * Antes de qualquer conteúdo do usuário ser enviado ao provedor de IA (e antes
 * de ser incluído em qualquer log), aplicamos este mascaramento. O objetivo é
 * reduzir a superfície de exposição de dados sensíveis sem impedir a análise:
 * a IA ainda consegue entender "um código de 6 dígitos foi solicitado" mesmo
 * com o código real substituído por [CÓDIGO MASCARADO].
 *
 * Este módulo é heurístico (regex) — não é uma DLP completa. Ele cobre os
 * padrões mais comuns citados no briefing do produto.
 */

export type PiiMatchType =
  | 'cpf'
  | 'cnpj'
  | 'rg'
  | 'telefone'
  | 'email'
  | 'cartao'
  | 'conta_bancaria'
  | 'chave_pix_aleatoria'
  | 'codigo_autenticacao'
  | 'cep';

export interface PiiMaskResult {
  masked: string;
  found: PiiMatchType[];
}

interface PiiRule {
  type: PiiMatchType;
  pattern: RegExp;
  replacement: string;
}

// Ordem importa: padrões mais específicos primeiro para evitar sobreposição
// incorreta (ex.: cartão de crédito antes de telefone).
const RULES: PiiRule[] = [
  {
    type: 'email',
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replacement: '[E-MAIL MASCARADO]',
  },
  {
    type: 'cartao',
    // 13-19 dígitos, com ou sem espaços/traços em grupos de 4
    pattern: /\b(?:\d[ -]?){13,19}\b/g,
    replacement: '[NÚMERO DE CARTÃO MASCARADO]',
  },
  {
    type: 'cpf',
    pattern: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,
    replacement: '[CPF MASCARADO]',
  },
  {
    type: 'cnpj',
    pattern: /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g,
    replacement: '[CNPJ MASCARADO]',
  },
  {
    type: 'cep',
    pattern: /\b\d{5}-?\d{3}\b/g,
    replacement: '[CEP MASCARADO]',
  },
  {
    type: 'telefone',
    pattern: /(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?9?\d{4}-?\d{4}\b/g,
    replacement: '[TELEFONE MASCARADO]',
  },
  {
    type: 'codigo_autenticacao',
    // Sequências isoladas de 4 a 8 dígitos, comumente códigos de SMS/2FA.
    // Aplicado por último e apenas em números "soltos" (não dentro de palavras).
    pattern: /\b\d{4,8}\b/g,
    replacement: '[CÓDIGO MASCARADO]',
  },
];

// Chave Pix aleatória (formato UUID)
const PIX_KEY_PATTERN = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g;

export function maskPii(input: string): PiiMaskResult {
  let masked = input;
  const found = new Set<PiiMatchType>();

  if (PIX_KEY_PATTERN.test(masked)) {
    found.add('chave_pix_aleatoria');
    masked = masked.replace(PIX_KEY_PATTERN, '[CHAVE PIX MASCARADA]');
  }

  for (const rule of RULES) {
    // reset lastIndex por reuso de regex global
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(masked)) {
      found.add(rule.type);
    }
    rule.pattern.lastIndex = 0;
    masked = masked.replace(rule.pattern, rule.replacement);
  }

  return { masked, found: Array.from(found) };
}

/**
 * Mensagem de aviso exibida ao usuário ANTES do envio, pedindo para não
 * incluir dados extremamente sensíveis (senhas e códigos não podem ser
 * "mascarados com segurança" pois o próprio ato de digitá-los já é risco).
 */
export const PRIVACY_WARNING =
  'Não envie senhas, códigos de autenticação completos, número completo de cartão, documentos ou outras informações extremamente sensíveis. Dados como CPF, telefone e e-mail são mascarados automaticamente antes da análise.';

/**
 * Camada de abstração para provedores de IA.
 *
 * Nenhuma outra parte do sistema deve importar um SDK de IA diretamente —
 * tudo passa por esta interface, permitindo trocar ou adicionar provedores
 * (OpenAI, Anthropic, outro futuro) sem alterar as rotas de API ou a lógica
 * de domínio. Todas as chamadas acontecem no backend; a chave de API NUNCA
 * é exposta ao frontend.
 */

export interface AICompletionParams {
  /** Instruções de sistema (regras do produto). Nunca contém texto do usuário. */
  system: string;
  /** Mensagem do usuário, já com o conteúdo não confiável devidamente delimitado. */
  user: string;
  maxTokens?: number;
  /** Timeout/cancelamento da chamada. */
  signal?: AbortSignal;
}

export interface AICompletionResult {
  /** Texto bruto retornado pelo modelo (espera-se JSON, validado pelo chamador). */
  text: string;
  provider: string;
  model: string;
}

export interface AIProvider {
  readonly name: string;
  complete(params: AICompletionParams): Promise<AICompletionResult>;
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AIProviderError';
  }
}

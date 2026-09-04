import OpenAI from 'openai';
import type { AICompletionParams, AICompletionResult, AIProvider } from './AIProvider';
import { AIProviderError } from './AIProvider';

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model = 'gpt-4o-mini') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async complete({ system, user, maxTokens = 2000, signal }: AICompletionParams): Promise<AICompletionResult> {
    try {
      const response = await this.client.chat.completions.create(
        {
          model: this.model,
          max_tokens: maxTokens,
          temperature: 0.2,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        },
        { signal },
      );

      const text = response.choices[0]?.message?.content;
      if (!text) {
        throw new AIProviderError('Resposta do provedor OpenAI não contém texto.');
      }

      return { text, provider: this.name, model: this.model };
    } catch (err) {
      if (err instanceof AIProviderError) throw err;
      throw new AIProviderError('Falha ao chamar o provedor OpenAI.', err);
    }
  }
}

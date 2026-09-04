import Anthropic from '@anthropic-ai/sdk';
import type { AICompletionParams, AICompletionResult, AIProvider } from './AIProvider';
import { AIProviderError } from './AIProvider';

export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic';
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model = 'claude-sonnet-5') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async complete({ system, user, maxTokens = 2000, signal }: AICompletionParams): Promise<AICompletionResult> {
    try {
      const response = await this.client.messages.create(
        {
          model: this.model,
          max_tokens: maxTokens,
          system,
          messages: [{ role: 'user', content: user }],
        },
        { signal },
      );

      const textBlock = response.content.find((block) => block.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        throw new AIProviderError('Resposta do provedor Anthropic não contém texto.');
      }

      return { text: textBlock.text, provider: this.name, model: this.model };
    } catch (err) {
      if (err instanceof AIProviderError) throw err;
      throw new AIProviderError('Falha ao chamar o provedor Anthropic.', err);
    }
  }
}

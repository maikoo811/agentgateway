/**
 * LLM API Pricing Configuration
 * 価格は1000トークンあたりのUSD（Anthropicのみ100万トークン単位）
 */

type ModelPricing = {
  input: number
  output: number
}

export const MODEL_PRICING = {
  openai: {
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  },
  anthropic: {
    'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },
    'claude-3-5-haiku-20241022': { input: 1.0, output: 5.0 },
    'claude-3-opus-20240229': { input: 15.0, output: 75.0 },
  },
} as const satisfies Record<string, Record<string, ModelPricing>>

export type Provider = keyof typeof MODEL_PRICING
export type OpenAIModel = keyof typeof MODEL_PRICING.openai
export type AnthropicModel = keyof typeof MODEL_PRICING.anthropic

function getModelPricing(provider: Provider, model: string): ModelPricing {
  const providerPricing = MODEL_PRICING[provider]

  if (model in providerPricing) {
    return providerPricing[model as keyof typeof providerPricing]
  }

  console.warn(`Unknown model: ${provider}/${model}, using default pricing`)
  if (provider === 'openai') {
    return MODEL_PRICING.openai['gpt-3.5-turbo']
  }
  return MODEL_PRICING.anthropic['claude-3-5-haiku-20241022']
}

/**
 * Calculate cost based on token usage
 */
export function calculateCost(
  provider: Provider,
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = getModelPricing(provider, model)

  if (provider === 'anthropic') {
    return (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000
  }

  return (inputTokens * pricing.input + outputTokens * pricing.output) / 1000
}

/**
 * Estimate token split when only total tokens are available
 * 通常、入力:出力 = 70:30 と仮定
 */
export function estimateTokenSplit(totalTokens: number): { input: number; output: number } {
  return {
    input: Math.floor(totalTokens * 0.7),
    output: Math.floor(totalTokens * 0.3),
  }
}

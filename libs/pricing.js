// Pricing configuration for voice AI providers
// Costs are in USD per minute

export const pricing = {
  retell: {
    // Base voice cost (ElevenLabs voices via Retell)
    voice: 0.07,
    // LLM costs per model
    models: {
      "gpt-4o": 0.06,
      "gpt-4o-mini": 0.01,
      "gpt-4.1": 0.08,
      "claude-4.5-sonnet": 0.06,
      "claude-3.5-haiku": 0.02,
    },
    // Default model cost if not found
    defaultModelCost: 0.06,
  },
  // Placeholder for future providers
  vapi: {
    voice: 0.05,
    models: {
      "gpt-4o": 0.06,
      "gpt-4o-mini": 0.01,
    },
    defaultModelCost: 0.05,
  },
  elevenlabs: {
    voice: 0.10,
    models: {
      "gpt-4o": 0.06,
      "gpt-4o-mini": 0.01,
    },
    defaultModelCost: 0.06,
  },
};

/**
 * Get the cost per minute for a given provider and model
 * @param {string} provider - Provider ID (retell, vapi, elevenlabs)
 * @param {string} model - Model ID (gpt-4o, etc.)
 * @returns {{ voice: number, llm: number, total: number }}
 */
export function getCostPerMinute(provider, model) {
  const providerPricing = pricing[provider] || pricing.retell;
  const voiceCost = providerPricing.voice;
  const llmCost = providerPricing.models[model] || providerPricing.defaultModelCost;

  return {
    voice: voiceCost,
    llm: llmCost,
    total: voiceCost + llmCost,
  };
}

/**
 * Format cost for display
 * @param {number} cost - Cost in USD
 * @returns {string}
 */
export function formatCost(cost) {
  if (cost < 0.01) {
    return `$${cost.toFixed(3)}`;
  }
  return `$${cost.toFixed(2)}`;
}

/**
 * Calculate estimated cost for a given duration
 * @param {number} durationSeconds - Duration in seconds
 * @param {string} provider - Provider ID
 * @param {string} model - Model ID
 * @returns {number}
 */
export function calculateCost(durationSeconds, provider, model) {
  const { total } = getCostPerMinute(provider, model);
  return (durationSeconds / 60) * total;
}

/**
 * Get cost examples for different call durations
 * @param {string} provider - Provider ID
 * @param {string} model - Model ID
 * @returns {Array<{ duration: string, cost: string }>}
 */
export function getCostExamples(provider, model) {
  const { total } = getCostPerMinute(provider, model);

  return [
    { duration: "1 min", cost: formatCost(total * 1) },
    { duration: "5 min", cost: formatCost(total * 5) },
    { duration: "10 min", cost: formatCost(total * 10) },
    { duration: "30 min", cost: formatCost(total * 30) },
  ];
}

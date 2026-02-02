// Provider error handling utilities

/**
 * Custom error class for provider API failures
 */
export class ProviderError extends Error {
  constructor(provider, operation, originalError) {
    const errorMessage = originalError?.response?.data?.message
      || originalError?.response?.data?.error
      || originalError?.message
      || "Unknown error";

    super(`${provider} ${operation} failed: ${errorMessage}`);
    this.name = "ProviderError";
    this.provider = provider;
    this.operation = operation;
    this.statusCode = originalError?.response?.status;
    this.originalError = originalError;
  }
}

/**
 * Wrapper for provider API calls with consistent error handling
 * @param {string} provider - Provider name (retell, vapi, elevenlabs)
 * @param {string} operation - Operation name (create, update, delete)
 * @param {Function} apiCall - Async function that makes the API call
 * @returns {Promise<any>} - Result of the API call
 */
export async function withProviderErrorHandling(provider, operation, apiCall) {
  try {
    return await apiCall();
  } catch (error) {
    console.error(
      `Provider API error [${provider}/${operation}]:`,
      error?.response?.data || error.message
    );
    throw new ProviderError(provider, operation, error);
  }
}

/**
 * Check if a provider API key is configured
 * @param {string} provider - Provider name
 * @returns {boolean}
 */
export function isProviderConfigured(provider) {
  switch (provider) {
    case "retell":
      return !!process.env.RETELL_API_KEY;
    case "vapi":
      return !!process.env.VAPI_API_KEY;
    case "elevenlabs":
      return !!process.env.ELEVENLABS_API_KEY;
    default:
      return false;
  }
}

/**
 * Get provider API key
 * @param {string} provider - Provider name
 * @returns {string|null}
 */
export function getProviderApiKey(provider) {
  switch (provider) {
    case "retell":
      return process.env.RETELL_API_KEY || null;
    case "vapi":
      return process.env.VAPI_API_KEY || null;
    case "elevenlabs":
      return process.env.ELEVENLABS_API_KEY || null;
    default:
      return null;
  }
}

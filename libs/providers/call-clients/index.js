// Call client factory for browser-side voice calls
// Dynamically creates the appropriate client based on provider

import { RetellCallClient } from "./retell-client";
import { VapiCallClient } from "./vapi-client";
import { ElevenLabsCallClient } from "./elevenlabs-client";

const clientClasses = {
  retell: RetellCallClient,
  vapi: VapiCallClient,
  elevenlabs: ElevenLabsCallClient,
};

/**
 * Create a call client for the specified provider
 * @param {string} provider - The provider name (retell, vapi, elevenlabs)
 * @returns {RetellCallClient|VapiCallClient|ElevenLabsCallClient} Call client instance
 */
export function createCallClient(provider) {
  const ClientClass = clientClasses[provider];
  if (!ClientClass) {
    throw new Error(`Unknown call provider: ${provider}`);
  }
  return new ClientClass();
}

/**
 * Check if a provider is supported for web calls
 * @param {string} provider - The provider name
 * @returns {boolean} Whether the provider is supported
 */
export function isCallProviderSupported(provider) {
  return provider in clientClasses;
}

export { RetellCallClient, VapiCallClient, ElevenLabsCallClient };

// Provider abstraction layer
// Factory function and utilities for voice AI providers

import * as retell from "./retell";
import * as vapi from "./vapi";
import * as elevenlabs from "./elevenlabs";

const providers = {
  retell,
  vapi,
  elevenlabs,
};

// Supported languages
const languages = [
  { code: "en-US", name: "English (US)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "en-AU", name: "English (Australia)" },
  { code: "es-ES", name: "Spanish (Spain)" },
  { code: "es-MX", name: "Spanish (Mexico)" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
  { code: "it-IT", name: "Italian" },
  { code: "pt-BR", name: "Portuguese (Brazil)" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ko-KR", name: "Korean" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
];

/**
 * Get a provider instance by name
 * @param {string} providerName - retell, vapi, or elevenlabs
 * @returns {object} Provider module
 */
export function getProvider(providerName) {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Unknown provider: ${providerName}`);
  }
  return provider;
}

/**
 * Get static voice list for a provider
 * @param {string} providerName - retell, vapi, or elevenlabs
 * @returns {Array} List of voices
 */
export function getProviderVoices(providerName) {
  const provider = providers[providerName];
  return provider?.voices || [];
}

/**
 * Get static model list for a provider
 * @param {string} providerName - retell, vapi, or elevenlabs
 * @returns {Array} List of models
 */
export function getProviderModels(providerName) {
  const provider = providers[providerName];
  return provider?.models || [];
}

/**
 * Get supported languages
 * @returns {Array} List of languages
 */
export function getLanguages() {
  return languages;
}

/**
 * Create an agent with the specified provider
 * @param {string} providerName - retell, vapi, or elevenlabs
 * @param {object} agentData - Agent configuration
 * @returns {Promise<object>} Provider response with providerAgentId
 */
export async function createProviderAgent(providerName, agentData) {
  const provider = getProvider(providerName);
  return provider.createAgent(agentData);
}

/**
 * Update an agent with the specified provider
 * @param {string} providerName - retell, vapi, or elevenlabs
 * @param {string} providerAgentId - Provider's agent ID
 * @param {object} agentData - Updated agent configuration
 * @returns {Promise<object>} Provider response
 */
export async function updateProviderAgent(providerName, providerAgentId, agentData) {
  const provider = getProvider(providerName);
  return provider.updateAgent(providerAgentId, agentData);
}

/**
 * Delete an agent with the specified provider
 * @param {string} providerName - retell, vapi, or elevenlabs
 * @param {string} providerAgentId - Provider's agent ID
 * @returns {Promise<object>} Provider response
 */
export async function deleteProviderAgent(providerName, providerAgentId) {
  const provider = getProvider(providerName);
  return provider.deleteAgent(providerAgentId);
}

/**
 * Fetch live voice list from provider API
 * @param {string} providerName - retell, vapi, or elevenlabs
 * @returns {Promise<Array>} List of voices
 */
export async function fetchProviderVoices(providerName) {
  const provider = getProvider(providerName);
  return provider.fetchVoices();
}

export default {
  getProvider,
  getProviderVoices,
  getProviderModels,
  getLanguages,
  createProviderAgent,
  updateProviderAgent,
  deleteProviderAgent,
  fetchProviderVoices,
};

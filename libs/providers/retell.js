// Retell AI provider implementation
import axios from "axios";
import { withProviderErrorHandling, isProviderConfigured } from "./utils";

const RETELL_BASE_URL = "https://api.retellai.com";

// Create axios instance for Retell API
const retellClient = axios.create({
  baseURL: RETELL_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth header dynamically
retellClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.RETELL_API_KEY}`;
  return config;
});

// Static voice list (can be fetched dynamically in future)
export const voices = [
  { id: "11labs-Adrian", name: "Adrian", gender: "Male" },
  { id: "11labs-Amy", name: "Amy", gender: "Female" },
  { id: "11labs-Brian", name: "Brian", gender: "Male" },
  { id: "11labs-Emma", name: "Emma", gender: "Female" },
  { id: "11labs-James", name: "James", gender: "Male" },
  { id: "11labs-Laura", name: "Laura", gender: "Female" },
  { id: "11labs-Michael", name: "Michael", gender: "Male" },
  { id: "11labs-Sarah", name: "Sarah", gender: "Female" },
];

export const models = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku" },
];

/**
 * Map SalesRepAI agent data to Retell API format
 */
function mapToRetellFormat(agentData) {
  return {
    agent_name: agentData.name,
    voice_id: agentData.voiceId,
    response_engine: {
      type: "retell-llm",
      llm_id: null, // Use default
    },
    llm_websocket_url: null, // For custom LLM integration
    language: agentData.language || "en-US",
    voice_temperature: 0.7,
    voice_speed: 1.0,
    responsiveness: 0.5,
    interruption_sensitivity: 0.5,
    enable_backchannel: true,
    begin_message: agentData.firstMessage,
    general_prompt: agentData.systemPrompt,
    // Knowledge base as general tools context
    general_tools: agentData.knowledgeBase?.length > 0 ? [{
      type: "end_call",
      name: "end_call",
      description: "End the call when the conversation is complete",
    }] : [],
  };
}

/**
 * Create a new agent with Retell
 */
export async function createAgent(agentData) {
  if (!isProviderConfigured("retell")) {
    console.warn("Retell API key not configured, skipping provider sync");
    return { providerAgentId: null };
  }

  return withProviderErrorHandling("retell", "create", async () => {
    const payload = mapToRetellFormat(agentData);
    const response = await retellClient.post("/create-agent", payload);
    return { providerAgentId: response.data.agent_id };
  });
}

/**
 * Update an existing agent with Retell
 */
export async function updateAgent(providerAgentId, agentData) {
  if (!isProviderConfigured("retell") || !providerAgentId) {
    console.warn("Retell API key not configured or no provider ID, skipping update");
    return { success: true };
  }

  return withProviderErrorHandling("retell", "update", async () => {
    const payload = mapToRetellFormat(agentData);
    await retellClient.patch(`/update-agent/${providerAgentId}`, payload);
    return { success: true };
  });
}

/**
 * Delete an agent from Retell
 */
export async function deleteAgent(providerAgentId) {
  if (!isProviderConfigured("retell") || !providerAgentId) {
    console.warn("Retell API key not configured or no provider ID, skipping delete");
    return { success: true };
  }

  return withProviderErrorHandling("retell", "delete", async () => {
    await retellClient.delete(`/delete-agent/${providerAgentId}`);
    return { success: true };
  });
}

/**
 * Fetch voices from Retell API
 */
export async function fetchVoices() {
  if (!isProviderConfigured("retell")) {
    return voices; // Return static list if not configured
  }

  try {
    const response = await retellClient.get("/list-voices");
    return response.data.map((voice) => ({
      id: voice.voice_id,
      name: voice.voice_name,
      gender: voice.gender,
    }));
  } catch (error) {
    console.error("Failed to fetch Retell voices:", error.message);
    return voices; // Fallback to static list
  }
}

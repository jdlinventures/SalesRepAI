// ElevenLabs Conversational AI provider implementation
import axios from "axios";
import { withProviderErrorHandling, isProviderConfigured } from "./utils";

const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io";

// Create axios instance for ElevenLabs API
const elevenLabsClient = axios.create({
  baseURL: ELEVENLABS_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth header dynamically (ElevenLabs uses xi-api-key header)
elevenLabsClient.interceptors.request.use((config) => {
  config.headers["xi-api-key"] = process.env.ELEVENLABS_API_KEY;
  return config;
});

// Static voice list (ElevenLabs pre-made voices)
export const voices = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", gender: "Female" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", gender: "Female" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", gender: "Female" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni", gender: "Male" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli", gender: "Female" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", gender: "Male" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", gender: "Male" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", gender: "Male" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam", gender: "Male" },
];

export const models = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
];

/**
 * Build system prompt with knowledge base context
 */
function buildSystemPromptWithKnowledge(agentData) {
  let prompt = agentData.systemPrompt;

  const knowledgeItems = agentData.knowledgeBase || [];
  if (knowledgeItems.length > 0) {
    const knowledgeContext = knowledgeItems
      .map((item) => {
        if (item.type === "url") {
          return `Reference URL: ${item.url}`;
        } else if (item.type === "file" && item.extractedText) {
          return `Document (${item.fileName}):\n${item.extractedText.substring(0, 5000)}`;
        }
        return null;
      })
      .filter(Boolean)
      .join("\n\n");

    if (knowledgeContext) {
      prompt += `\n\n--- Knowledge Base ---\n${knowledgeContext}`;
    }
  }

  return prompt;
}

/**
 * Map SalesRepAI agent data to ElevenLabs API format
 */
function mapToElevenLabsFormat(agentData) {
  return {
    name: agentData.name,
    conversation_config: {
      agent: {
        prompt: {
          prompt: buildSystemPromptWithKnowledge(agentData),
        },
        first_message: agentData.firstMessage,
        language: agentData.language || "en",
      },
      tts: {
        voice_id: agentData.voiceId,
      },
    },
  };
}

/**
 * Create a new agent with ElevenLabs
 */
export async function createAgent(agentData) {
  if (!isProviderConfigured("elevenlabs")) {
    console.warn("ElevenLabs API key not configured, skipping provider sync");
    return { providerAgentId: null };
  }

  return withProviderErrorHandling("elevenlabs", "create", async () => {
    const payload = mapToElevenLabsFormat(agentData);
    const response = await elevenLabsClient.post("/v1/convai/agents/create", payload);
    return { providerAgentId: response.data.agent_id };
  });
}

/**
 * Update an existing agent with ElevenLabs
 */
export async function updateAgent(providerAgentId, agentData) {
  if (!isProviderConfigured("elevenlabs") || !providerAgentId) {
    console.warn("ElevenLabs API key not configured or no provider ID, skipping update");
    return { success: true };
  }

  return withProviderErrorHandling("elevenlabs", "update", async () => {
    const payload = mapToElevenLabsFormat(agentData);
    await elevenLabsClient.patch(`/v1/convai/agents/${providerAgentId}`, payload);
    return { success: true };
  });
}

/**
 * Delete an agent from ElevenLabs
 */
export async function deleteAgent(providerAgentId) {
  if (!isProviderConfigured("elevenlabs") || !providerAgentId) {
    console.warn("ElevenLabs API key not configured or no provider ID, skipping delete");
    return { success: true };
  }

  return withProviderErrorHandling("elevenlabs", "delete", async () => {
    await elevenLabsClient.delete(`/v1/convai/agents/${providerAgentId}`);
    return { success: true };
  });
}

/**
 * Fetch voices from ElevenLabs API
 */
export async function fetchVoices() {
  if (!isProviderConfigured("elevenlabs")) {
    return voices; // Return static list if not configured
  }

  try {
    const response = await elevenLabsClient.get("/v1/voices");
    return response.data.voices.map((voice) => ({
      id: voice.voice_id,
      name: voice.name,
      gender: voice.labels?.gender || null,
    }));
  } catch (error) {
    console.error("Failed to fetch ElevenLabs voices:", error.message);
    return voices; // Fallback to static list
  }
}

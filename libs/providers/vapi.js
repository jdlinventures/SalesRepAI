// Vapi provider implementation
import axios from "axios";
import { withProviderErrorHandling, isProviderConfigured } from "./utils";

const VAPI_BASE_URL = "https://api.vapi.ai";

// Create axios instance for Vapi API
const vapiClient = axios.create({
  baseURL: VAPI_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth header dynamically (Vapi doesn't use "Bearer" prefix)
vapiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.VAPI_API_KEY}`;
  return config;
});

// Static voice list
export const voices = [
  { id: "burt", name: "Burt", gender: "Male" },
  { id: "marissa", name: "Marissa", gender: "Female" },
  { id: "andrea", name: "Andrea", gender: "Female" },
  { id: "sarah", name: "Sarah", gender: "Female" },
  { id: "phillip", name: "Phillip", gender: "Male" },
  { id: "steve", name: "Steve", gender: "Male" },
];

export const models = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
  { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
];

/**
 * Map SalesRepAI agent data to Vapi API format
 */
function mapToVapiFormat(agentData) {
  return {
    name: agentData.name,
    firstMessage: agentData.firstMessage,
    model: {
      provider: "openai",
      model: agentData.llmModel || "gpt-4o",
      messages: [
        {
          role: "system",
          content: agentData.systemPrompt,
        },
      ],
    },
    voice: {
      provider: "11labs",
      voiceId: agentData.voiceId,
    },
    transcriber: {
      provider: "deepgram",
      language: agentData.language?.split("-")[0] || "en",
    },
    // Include knowledge base content in system prompt context
    ...(agentData.knowledgeBase?.length > 0 && {
      model: {
        provider: "openai",
        model: agentData.llmModel || "gpt-4o",
        messages: [
          {
            role: "system",
            content: buildSystemPromptWithKnowledge(agentData),
          },
        ],
      },
    }),
  };
}

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
 * Create a new assistant with Vapi
 */
export async function createAgent(agentData) {
  if (!isProviderConfigured("vapi")) {
    console.warn("Vapi API key not configured, skipping provider sync");
    return { providerAgentId: null };
  }

  return withProviderErrorHandling("vapi", "create", async () => {
    const payload = mapToVapiFormat(agentData);
    const response = await vapiClient.post("/assistant", payload);
    return { providerAgentId: response.data.id };
  });
}

/**
 * Update an existing assistant with Vapi
 */
export async function updateAgent(providerAgentId, agentData) {
  if (!isProviderConfigured("vapi") || !providerAgentId) {
    console.warn("Vapi API key not configured or no provider ID, skipping update");
    return { success: true };
  }

  return withProviderErrorHandling("vapi", "update", async () => {
    const payload = mapToVapiFormat(agentData);
    await vapiClient.patch(`/assistant/${providerAgentId}`, payload);
    return { success: true };
  });
}

/**
 * Delete an assistant from Vapi
 */
export async function deleteAgent(providerAgentId) {
  if (!isProviderConfigured("vapi") || !providerAgentId) {
    console.warn("Vapi API key not configured or no provider ID, skipping delete");
    return { success: true };
  }

  return withProviderErrorHandling("vapi", "delete", async () => {
    await vapiClient.delete(`/assistant/${providerAgentId}`);
    return { success: true };
  });
}

/**
 * Fetch voices from Vapi API
 */
export async function fetchVoices() {
  if (!isProviderConfigured("vapi")) {
    return voices; // Return static list if not configured
  }

  // Vapi uses various voice providers, return static list for now
  return voices;
}

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
  { id: "gpt-4.1", name: "GPT-4.1" },
  { id: "claude-4.5-sonnet", name: "Claude 4.5 Sonnet" },
  { id: "claude-3.5-haiku", name: "Claude 3.5 Haiku" },
];

/**
 * Map agent data to Retell LLM format
 */
function mapToRetellLlmFormat(agentData) {
  return {
    model: agentData.llmModel || "gpt-4o",
    general_prompt: agentData.systemPrompt,
    begin_message: agentData.firstMessage,
    general_tools: [
      {
        type: "end_call",
        name: "end_call",
        description: "End the call when the conversation is complete",
      },
    ],
  };
}

/**
 * Map SalesRepAI agent data to Retell Agent API format
 */
function mapToRetellAgentFormat(agentData, llmId) {
  return {
    agent_name: agentData.name,
    voice_id: agentData.voiceId,
    response_engine: {
      type: "retell-llm",
      llm_id: llmId,
    },
    language: agentData.language || "en-US",
    voice_temperature: 0.7,
    voice_speed: 1.0,
    responsiveness: 0.5,
    interruption_sensitivity: 0.5,
    enable_backchannel: true,
  };
}

/**
 * Create a new agent with Retell
 * First creates an LLM, then creates an agent using that LLM
 */
export async function createAgent(agentData) {
  if (!isProviderConfigured("retell")) {
    console.warn("Retell API key not configured, skipping provider sync");
    return { providerAgentId: null };
  }

  return withProviderErrorHandling("retell", "create", async () => {
    // Step 1: Create the LLM with the prompt and model
    const llmPayload = mapToRetellLlmFormat(agentData);
    const llmResponse = await retellClient.post("/create-retell-llm", llmPayload);
    const llmId = llmResponse.data.llm_id;

    // Step 2: Create the agent using the LLM ID
    const agentPayload = mapToRetellAgentFormat(agentData, llmId);
    const agentResponse = await retellClient.post("/create-agent", agentPayload);

    return {
      providerAgentId: agentResponse.data.agent_id,
      providerLlmId: llmId,
    };
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
    // First get the current agent to find the LLM ID
    const agentResponse = await retellClient.get(`/get-agent/${providerAgentId}`);
    const llmId = agentResponse.data.response_engine?.llm_id;

    // Update the LLM if we have one
    if (llmId) {
      const llmPayload = mapToRetellLlmFormat(agentData);
      await retellClient.patch(`/update-retell-llm/${llmId}`, llmPayload);
    }

    // Update the agent
    const agentPayload = {
      agent_name: agentData.name,
      voice_id: agentData.voiceId,
      language: agentData.language || "en-US",
    };
    await retellClient.patch(`/update-agent/${providerAgentId}`, agentPayload);

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

/**
 * Register a web call with Retell
 * Returns an access token for the RetellWebClient
 */
export async function registerCall(providerAgentId) {
  if (!isProviderConfigured("retell")) {
    throw new Error("Retell API key not configured");
  }

  if (!providerAgentId) {
    throw new Error("Provider agent ID is required for Retell calls");
  }

  return withProviderErrorHandling("retell", "registerCall", async () => {
    const response = await retellClient.post("/v2/create-web-call", {
      agent_id: providerAgentId,
    });
    return {
      accessToken: response.data.access_token,
      callId: response.data.call_id,
    };
  });
}

/**
 * Get call details from Retell including recording URL
 * Recording is available after the call ends
 */
export async function getCallDetails(providerCallId) {
  if (!isProviderConfigured("retell")) {
    throw new Error("Retell API key not configured");
  }

  if (!providerCallId) {
    throw new Error("Provider call ID is required");
  }

  return withProviderErrorHandling("retell", "getCallDetails", async () => {
    const response = await retellClient.get(`/v2/get-call/${providerCallId}`);
    const data = response.data;

    // Parse transcript - Retell may return it in different formats
    let transcript = [];
    if (data.transcript) {
      if (Array.isArray(data.transcript)) {
        transcript = data.transcript;
      } else if (typeof data.transcript === "string") {
        // Retell sometimes returns transcript as a plain text string
        // We'll keep it as-is since it's already readable
        transcript = data.transcript;
      }
    }
    if (data.transcript_object && Array.isArray(data.transcript_object)) {
      transcript = data.transcript_object;
    }

    // Log for debugging
    console.log("[Retell] Call details:", {
      callId: data.call_id,
      status: data.call_status,
      hasRecording: !!data.recording_url,
      recording_url_raw: data.recording_url,
      transcriptType: typeof data.transcript,
      transcriptIsArray: Array.isArray(transcript),
    });

    const result = {
      callId: data.call_id,
      status: data.call_status,
      recordingUrl: data.recording_url || null,
      transcript,
      startTime: data.start_timestamp,
      endTime: data.end_timestamp,
      duration: data.call_analysis?.call_duration_sec || null,
    };

    console.log("[Retell] Returning result:", {
      recordingUrl: result.recordingUrl,
      hasRecordingUrl: !!result.recordingUrl,
    });

    return result;
  });
}

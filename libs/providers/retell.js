// Retell AI provider stub
// Full implementation will be added in Phase 2

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
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "claude-3-opus", name: "Claude 3 Opus" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
];

// Stub functions for Phase 2 implementation
export async function createAgent(agentData) {
  // TODO: Implement Retell API integration
  console.log("Retell createAgent stub called", agentData);
  return { providerAgentId: `retell_stub_${Date.now()}` };
}

export async function updateAgent(providerAgentId, agentData) {
  // TODO: Implement Retell API integration
  console.log("Retell updateAgent stub called", providerAgentId, agentData);
  return { success: true };
}

export async function deleteAgent(providerAgentId) {
  // TODO: Implement Retell API integration
  console.log("Retell deleteAgent stub called", providerAgentId);
  return { success: true };
}

export async function fetchVoices() {
  // TODO: Fetch from Retell API
  return voices;
}

// Vapi provider stub
// Full implementation will be added in Phase 2

export const voices = [
  { id: "vapi-alex", name: "Alex", gender: "Male" },
  { id: "vapi-bella", name: "Bella", gender: "Female" },
  { id: "vapi-charlie", name: "Charlie", gender: "Male" },
  { id: "vapi-diana", name: "Diana", gender: "Female" },
  { id: "vapi-ethan", name: "Ethan", gender: "Male" },
  { id: "vapi-fiona", name: "Fiona", gender: "Female" },
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
  // TODO: Implement Vapi API integration
  console.log("Vapi createAgent stub called", agentData);
  return { providerAgentId: `vapi_stub_${Date.now()}` };
}

export async function updateAgent(providerAgentId, agentData) {
  // TODO: Implement Vapi API integration
  console.log("Vapi updateAgent stub called", providerAgentId, agentData);
  return { success: true };
}

export async function deleteAgent(providerAgentId) {
  // TODO: Implement Vapi API integration
  console.log("Vapi deleteAgent stub called", providerAgentId);
  return { success: true };
}

export async function fetchVoices() {
  // TODO: Fetch from Vapi API
  return voices;
}

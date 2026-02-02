// ElevenLabs provider stub
// Full implementation will be added in Phase 2

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
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "claude-3-opus", name: "Claude 3 Opus" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
];

// Stub functions for Phase 2 implementation
export async function createAgent(agentData) {
  // TODO: Implement ElevenLabs API integration
  console.log("ElevenLabs createAgent stub called", agentData);
  return { providerAgentId: `elevenlabs_stub_${Date.now()}` };
}

export async function updateAgent(providerAgentId, agentData) {
  // TODO: Implement ElevenLabs API integration
  console.log("ElevenLabs updateAgent stub called", providerAgentId, agentData);
  return { success: true };
}

export async function deleteAgent(providerAgentId) {
  // TODO: Implement ElevenLabs API integration
  console.log("ElevenLabs deleteAgent stub called", providerAgentId);
  return { success: true };
}

export async function fetchVoices() {
  // TODO: Fetch from ElevenLabs API
  return voices;
}

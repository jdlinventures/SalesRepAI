// Vapi Web Client wrapper for browser-side calls
// Uses @vapi-ai/web

import Vapi from "@vapi-ai/web";

export class VapiCallClient {
  constructor() {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error("NEXT_PUBLIC_VAPI_PUBLIC_KEY environment variable is required");
    }
    this.client = new Vapi(publicKey);
    this.isConnected = false;
    this.isMuted = false;
    this.eventHandlers = {};
    this.currentTranscript = [];
  }

  // Register event handlers
  on(event, handler) {
    this.eventHandlers[event] = handler;

    // Map events to Vapi SDK events
    switch (event) {
      case "call_started":
        this.client.on("call-start", () => {
          this.isConnected = true;
          this.currentTranscript = [];
          handler();
        });
        break;
      case "call_ended":
        this.client.on("call-end", () => {
          this.isConnected = false;
          handler();
        });
        break;
      case "transcript":
        // Vapi uses "message" event for transcript updates
        this.client.on("message", (message) => {
          if (message.type === "transcript") {
            // Vapi sends transcript updates incrementally
            const entry = {
              role: message.role === "assistant" ? "agent" : "user",
              content: message.transcript,
              timestamp: new Date(),
            };

            // Update or add transcript entry
            if (message.transcriptType === "final") {
              this.currentTranscript.push(entry);
              handler([...this.currentTranscript]);
            }
          } else if (message.type === "speech-update") {
            // Handle real-time speech updates for more responsive UI
            const entry = {
              role: message.role === "assistant" ? "agent" : "user",
              content: message.speech || "",
              timestamp: new Date(),
              interim: true,
            };
            handler([...this.currentTranscript, entry]);
          }
        });
        break;
      case "error":
        this.client.on("error", (error) => {
          this.isConnected = false;
          handler(error);
        });
        break;
      default:
        break;
    }

    return this;
  }

  // Start a call with assistant ID
  async startCall(credentials) {
    try {
      await this.client.start(credentials.assistantId);
    } catch (error) {
      console.error("Vapi startCall error:", error);
      throw error;
    }
  }

  // End the current call
  async endCall() {
    try {
      this.client.stop();
      this.isConnected = false;
    } catch (error) {
      console.error("Vapi endCall error:", error);
      throw error;
    }
  }

  // Mute microphone
  mute() {
    try {
      this.client.setMuted(true);
      this.isMuted = true;
    } catch (error) {
      console.error("Vapi mute error:", error);
    }
  }

  // Unmute microphone
  unmute() {
    try {
      this.client.setMuted(false);
      this.isMuted = false;
    } catch (error) {
      console.error("Vapi unmute error:", error);
    }
  }

  // Toggle mute state
  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
    return this.isMuted;
  }

  // Clean up resources
  destroy() {
    if (this.isConnected) {
      this.client.stop();
    }
    this.eventHandlers = {};
  }
}

export default VapiCallClient;

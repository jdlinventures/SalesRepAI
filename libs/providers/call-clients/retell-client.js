// Retell Web Client wrapper for browser-side calls
// Uses retell-client-js-sdk

import { RetellWebClient } from "retell-client-js-sdk";

export class RetellCallClient {
  constructor() {
    this.client = new RetellWebClient();
    this.isConnected = false;
    this.eventHandlers = {};
  }

  // Register event handlers
  on(event, handler) {
    this.eventHandlers[event] = handler;

    // Map events to Retell SDK events
    switch (event) {
      case "call_started":
        this.client.on("call_started", () => {
          this.isConnected = true;
          handler();
        });
        break;
      case "call_ended":
        this.client.on("call_ended", () => {
          this.isConnected = false;
          handler();
        });
        break;
      case "transcript":
        // Retell uses "update" event for transcript updates
        this.client.on("update", (update) => {
          if (update.transcript) {
            // Convert Retell transcript format to our format
            const entries = update.transcript.map((entry) => ({
              role: entry.role === "agent" ? "agent" : "user",
              content: entry.content,
              timestamp: new Date(),
            }));
            handler(entries);
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

  // Start a call with access token
  async startCall(credentials) {
    try {
      await this.client.startCall({
        accessToken: credentials.accessToken,
        sampleRate: 24000,
        captureDeviceId: "default",
      });
    } catch (error) {
      console.error("Retell startCall error:", error);
      throw error;
    }
  }

  // End the current call
  async endCall() {
    try {
      this.client.stopCall();
      this.isConnected = false;
    } catch (error) {
      console.error("Retell endCall error:", error);
      throw error;
    }
  }

  // Clean up resources
  destroy() {
    if (this.isConnected) {
      this.client.stopCall();
    }
    this.eventHandlers = {};
  }
}

export default RetellCallClient;

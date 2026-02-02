// ElevenLabs Conversational AI WebSocket client for browser-side calls
// Uses native WebSocket with ElevenLabs signed URL

export class ElevenLabsCallClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.isMuted = false;
    this.eventHandlers = {};
    this.currentTranscript = [];
    this.audioContext = null;
    this.mediaStream = null;
    this.mediaRecorder = null;
  }

  // Register event handlers
  on(event, handler) {
    this.eventHandlers[event] = handler;
    return this;
  }

  // Emit event to handlers
  emit(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event](data);
    }
  }

  // Initialize audio context and microphone
  async initializeAudio() {
    try {
      // Get microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Create audio context for processing
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000,
      });

      return true;
    } catch (error) {
      console.error("Failed to initialize audio:", error);
      throw new Error("Microphone access denied");
    }
  }

  // Start a call with signed WebSocket URL
  async startCall(credentials) {
    try {
      // Initialize audio first
      await this.initializeAudio();

      // Connect to ElevenLabs WebSocket
      this.socket = new WebSocket(credentials.signedUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.currentTranscript = [];
        this.emit("call_started");
        this.startAudioCapture();
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.emit("error", error);
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.stopAudioCapture();
        this.emit("call_ended");
      };
    } catch (error) {
      console.error("ElevenLabs startCall error:", error);
      throw error;
    }
  }

  // Handle incoming WebSocket messages
  handleMessage(message) {
    switch (message.type) {
      case "agent_response":
        // Agent's spoken response
        if (message.agent_response_text) {
          this.currentTranscript.push({
            role: "agent",
            content: message.agent_response_text,
            timestamp: new Date(),
          });
          this.emit("transcript", [...this.currentTranscript]);
        }
        break;

      case "user_transcript":
        // User's transcribed speech
        if (message.user_transcript_text) {
          this.currentTranscript.push({
            role: "user",
            content: message.user_transcript_text,
            timestamp: new Date(),
          });
          this.emit("transcript", [...this.currentTranscript]);
        }
        break;

      case "audio":
        // Audio data from agent - play it
        if (message.audio_data) {
          this.playAudio(message.audio_data);
        }
        break;

      case "ping":
        // Respond to ping with pong
        this.send({ type: "pong" });
        break;

      case "conversation_ended":
        // Conversation ended by agent
        this.endCall();
        break;

      default:
        break;
    }
  }

  // Start capturing microphone audio
  startAudioCapture() {
    if (!this.mediaStream || !this.audioContext) return;

    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (event) => {
      if (!this.isConnected || this.isMuted) return;

      const inputData = event.inputBuffer.getChannelData(0);
      // Convert Float32Array to Int16Array for sending
      const int16Data = this.convertFloat32ToInt16(inputData);
      // Convert to base64 for sending
      const base64Audio = this.arrayBufferToBase64(int16Data.buffer);

      this.send({
        type: "audio",
        audio_data: base64Audio,
      });
    };

    source.connect(processor);
    processor.connect(this.audioContext.destination);

    this.audioProcessor = processor;
    this.audioSource = source;
  }

  // Stop audio capture
  stopAudioCapture() {
    if (this.audioProcessor) {
      this.audioProcessor.disconnect();
      this.audioProcessor = null;
    }
    if (this.audioSource) {
      this.audioSource.disconnect();
      this.audioSource = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  // Play audio from agent
  async playAudio(base64Audio) {
    try {
      const audioData = this.base64ToArrayBuffer(base64Audio);
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(audioData);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  // Send message through WebSocket
  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  // End the current call
  async endCall() {
    try {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.send({ type: "end_conversation" });
        this.socket.close();
      }
      this.stopAudioCapture();
      this.isConnected = false;
    } catch (error) {
      console.error("ElevenLabs endCall error:", error);
      throw error;
    }
  }

  // Mute microphone
  mute() {
    this.isMuted = true;
  }

  // Unmute microphone
  unmute() {
    this.isMuted = false;
  }

  // Toggle mute state
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Clean up resources
  destroy() {
    this.endCall();
    this.eventHandlers = {};
  }

  // Utility: Convert Float32Array to Int16Array
  convertFloat32ToInt16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16Array;
  }

  // Utility: ArrayBuffer to Base64
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Utility: Base64 to ArrayBuffer
  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

export default ElevenLabsCallClient;

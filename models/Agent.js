import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// AGENT SCHEMA
const agentSchema = mongoose.Schema(
  {
    // Reference to the user who owns this agent
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Agent display name
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    // Voice AI provider (retell, vapi, elevenlabs)
    provider: {
      type: String,
      required: true,
      enum: ["retell", "vapi", "elevenlabs"],
    },
    // System prompt that defines agent behavior
    systemPrompt: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    // First message the agent says when call starts
    firstMessage: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    // Knowledge base URLs for context
    knowledgeBase: {
      type: [String],
      default: [],
    },
    // Voice configuration
    voiceId: {
      type: String,
      required: true,
    },
    voiceName: {
      type: String,
      required: true,
    },
    // LLM model to use
    llmModel: {
      type: String,
      required: true,
      default: "gpt-4",
    },
    // Language code (e.g., "en-US")
    language: {
      type: String,
      required: true,
      default: "en-US",
    },
    // ID returned by the provider after creating the agent
    providerAgentId: {
      type: String,
      default: null,
    },
    // Usage tracking
    lastUsedAt: {
      type: Date,
      default: null,
    },
    totalCalls: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number, // in seconds
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Compound index for efficient user queries sorted by creation date
agentSchema.index({ userId: 1, createdAt: -1 });

// Add plugin that converts mongoose to json
agentSchema.plugin(toJSON);

export default mongoose.models.Agent || mongoose.model("Agent", agentSchema);

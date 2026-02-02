import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// Schema for knowledge base items (URLs and files)
const knowledgeBaseItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["url", "file"],
      required: true,
    },
    // For URLs
    url: {
      type: String,
    },
    // For files
    fileName: {
      type: String,
    },
    fileUrl: {
      type: String, // Vercel Blob URL
    },
    fileSize: {
      type: Number, // in bytes
    },
    mimeType: {
      type: String,
    },
    // Extracted text content (for provider APIs)
    extractedText: {
      type: String,
      maxlength: 100000,
    },
    // Metadata
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

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
    // Knowledge base (URLs and files)
    knowledgeBase: {
      type: [knowledgeBaseItemSchema],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 20; // Max 20 knowledge base items
        },
        message: "Maximum 20 knowledge base items allowed",
      },
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
      default: "gpt-4o",
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

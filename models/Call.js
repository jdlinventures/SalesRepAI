import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// Schema for transcript entries
const transcriptEntrySchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["agent", "user"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// CALL SCHEMA - Stores call history and transcripts
const callSchema = mongoose.Schema(
  {
    // Reference to the agent used for this call
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
      index: true,
    },
    // Reference to the user who made this call
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Voice AI provider (retell, vapi, elevenlabs)
    provider: {
      type: String,
      required: true,
      enum: ["retell", "vapi", "elevenlabs"],
    },
    // Call ID from the provider
    providerCallId: {
      type: String,
      default: null,
    },
    // Call status
    status: {
      type: String,
      required: true,
      enum: ["pending", "ringing", "in-progress", "ended", "failed"],
      default: "pending",
    },
    // Timestamps
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    // Call duration in seconds
    duration: {
      type: Number,
      default: 0,
    },
    // Real-time transcript
    transcript: {
      type: [transcriptEntrySchema],
      default: [],
    },
    // How the call ended
    endReason: {
      type: String,
      default: null,
    },
    // Error message if call failed
    errorMessage: {
      type: String,
      default: null,
    },
    // Recording URL from provider
    recordingUrl: {
      type: String,
      default: null,
    },
    // Estimated cost in USD
    estimatedCost: {
      type: Number,
      default: null,
    },
    // LLM model used (for cost calculation)
    llmModel: {
      type: String,
      default: "gpt-4o",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Compound index for efficient user queries sorted by creation date
callSchema.index({ userId: 1, createdAt: -1 });
// Index for looking up calls by agent
callSchema.index({ agentId: 1, createdAt: -1 });

// Add plugin that converts mongoose to json
callSchema.plugin(toJSON);

export default mongoose.models.Call || mongoose.model("Call", callSchema);

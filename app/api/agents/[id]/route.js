import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import Agent from "@/models/Agent";
import {
  createProviderAgent,
  updateProviderAgent,
  deleteProviderAgent,
} from "@/libs/providers";

// Helper to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Normalize knowledge base to new object format
 */
function normalizeKnowledgeBase(knowledgeBase) {
  if (!knowledgeBase || !Array.isArray(knowledgeBase)) {
    return [];
  }

  return knowledgeBase.map((item) => {
    if (typeof item === "string") {
      return { type: "url", url: item, addedAt: new Date() };
    }
    return item;
  });
}

// GET /api/agents/[id] - Get a single agent
export async function GET(req, { params }) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 });
    }

    await connectMongo();

    const agent = await Agent.findById(id);

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Check ownership
    if (agent.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Normalize knowledge base in response
    const agentJson = agent.toJSON();
    agentJson.knowledgeBase = normalizeKnowledgeBase(agentJson.knowledgeBase);

    return NextResponse.json(agentJson);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

// PUT /api/agents/[id] - Update an agent
export async function PUT(req, { params }) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 });
    }

    await connectMongo();

    const agent = await Agent.findById(id);

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Check ownership
    if (agent.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    // Validate provider if provided
    const validProviders = ["retell", "vapi", "elevenlabs"];
    if (body.provider && !validProviders.includes(body.provider)) {
      return NextResponse.json(
        { error: "Invalid provider. Must be retell, vapi, or elevenlabs" },
        { status: 400 }
      );
    }

    // Check if provider is changing
    const providerChanged = body.provider && body.provider !== agent.provider;
    const oldProvider = agent.provider;
    const oldProviderAgentId = agent.providerAgentId;

    // Update allowed fields
    const allowedFields = [
      "name",
      "provider",
      "systemPrompt",
      "firstMessage",
      "knowledgeBase",
      "voiceId",
      "voiceName",
      "llmModel",
      "language",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "knowledgeBase") {
          agent[field] = normalizeKnowledgeBase(body[field]);
        } else {
          agent[field] = body[field];
        }
      }
    }

    await agent.save();

    // Sync with provider API
    const agentData = {
      name: agent.name,
      systemPrompt: agent.systemPrompt,
      firstMessage: agent.firstMessage,
      voiceId: agent.voiceId,
      llmModel: agent.llmModel,
      language: agent.language,
      knowledgeBase: agent.knowledgeBase,
    };

    try {
      if (providerChanged) {
        // Delete from old provider (best effort)
        if (oldProviderAgentId) {
          try {
            await deleteProviderAgent(oldProvider, oldProviderAgentId);
          } catch (e) {
            console.warn("Failed to delete from old provider:", e.message);
          }
        }

        // Create on new provider
        const providerResponse = await createProviderAgent(
          agent.provider,
          agentData
        );
        if (providerResponse?.providerAgentId) {
          agent.providerAgentId = providerResponse.providerAgentId;
          await agent.save();
        }
      } else if (agent.providerAgentId) {
        // Update existing provider agent
        await updateProviderAgent(
          agent.provider,
          agent.providerAgentId,
          agentData
        );
      } else {
        // No provider ID yet, create one
        const providerResponse = await createProviderAgent(
          agent.provider,
          agentData
        );
        if (providerResponse?.providerAgentId) {
          agent.providerAgentId = providerResponse.providerAgentId;
          await agent.save();
        }
      }
    } catch (providerError) {
      console.error("Provider sync failed:", providerError.message);
      // Don't fail the request, local update succeeded
    }

    return NextResponse.json(agent.toJSON());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

// DELETE /api/agents/[id] - Delete an agent
export async function DELETE(req, { params }) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 });
    }

    await connectMongo();

    const agent = await Agent.findById(id);

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Check ownership
    if (agent.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete from provider first (best effort)
    if (agent.providerAgentId) {
      try {
        await deleteProviderAgent(agent.provider, agent.providerAgentId);
      } catch (providerError) {
        console.warn("Failed to delete from provider:", providerError.message);
        // Continue with local deletion anyway
      }
    }

    await Agent.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

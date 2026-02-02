import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import Agent from "@/models/Agent";
import { createProviderAgent } from "@/libs/providers";

// GET /api/agents - List all agents for authenticated user
export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await connectMongo();

    const agents = await Agent.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Transform _id to id and normalize knowledge base for each agent
    const transformedAgents = agents.map((agent) => ({
      ...agent,
      id: agent._id.toString(),
      _id: undefined,
      // Normalize old string array format to new object format
      knowledgeBase: normalizeKnowledgeBase(agent.knowledgeBase),
    }));

    return NextResponse.json(transformedAgents);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

// POST /api/agents - Create a new agent
export async function POST(req) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await connectMongo();

    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "provider",
      "systemPrompt",
      "firstMessage",
      "voiceId",
      "voiceName",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate provider value
    const validProviders = ["retell", "vapi", "elevenlabs"];
    if (!validProviders.includes(body.provider)) {
      return NextResponse.json(
        { error: "Invalid provider. Must be retell, vapi, or elevenlabs" },
        { status: 400 }
      );
    }

    // Normalize knowledge base format
    const knowledgeBase = normalizeKnowledgeBase(body.knowledgeBase || []);

    // Create the agent in database first
    const agent = await Agent.create({
      userId: session.user.id,
      name: body.name,
      provider: body.provider,
      systemPrompt: body.systemPrompt,
      firstMessage: body.firstMessage,
      knowledgeBase,
      voiceId: body.voiceId,
      voiceName: body.voiceName,
      llmModel: body.llmModel || "gpt-4o",
      language: body.language || "en-US",
    });

    // Sync with provider API
    try {
      const providerResponse = await createProviderAgent(body.provider, {
        name: body.name,
        systemPrompt: body.systemPrompt,
        firstMessage: body.firstMessage,
        voiceId: body.voiceId,
        llmModel: body.llmModel || "gpt-4o",
        language: body.language || "en-US",
        knowledgeBase,
      });

      // Update agent with provider ID if sync succeeded
      if (providerResponse?.providerAgentId) {
        agent.providerAgentId = providerResponse.providerAgentId;
        await agent.save();
      }
    } catch (providerError) {
      // Log provider error but don't fail the request
      // Agent is created locally, provider sync can be retried later
      console.error("Provider sync failed:", providerError.message);
    }

    return NextResponse.json(agent.toJSON(), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

/**
 * Normalize knowledge base to new object format
 * Handles both old string array format and new object format
 */
function normalizeKnowledgeBase(knowledgeBase) {
  if (!knowledgeBase || !Array.isArray(knowledgeBase)) {
    return [];
  }

  return knowledgeBase.map((item) => {
    // Handle old string format (URLs only)
    if (typeof item === "string") {
      return {
        type: "url",
        url: item,
        addedAt: new Date(),
      };
    }
    // Already in object format
    return item;
  });
}

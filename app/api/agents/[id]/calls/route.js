import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import Agent from "@/models/Agent";
import Call from "@/models/Call";
import { getProvider } from "@/libs/providers";
import { isProviderConfigured } from "@/libs/providers/utils";

// GET /api/agents/[id]/calls - Get call history for an agent
export async function GET(req, { params }) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await connectMongo();
    const { id } = await params;

    // Verify agent exists and belongs to user
    const agent = await Agent.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Fetch calls for this agent, sorted by most recent first
    const calls = await Call.find({
      agentId: id,
      userId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const transformedCalls = calls.map((call) => ({
      ...call,
      id: call._id.toString(),
      _id: undefined,
      agentId: call.agentId.toString(),
      userId: undefined,
    }));

    return NextResponse.json(transformedCalls);
  } catch (e) {
    console.error("Error fetching call history:", e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

// POST /api/agents/[id]/calls - Start a new call
export async function POST(req, { params }) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await connectMongo();
    const { id } = await params;

    // Verify agent exists and belongs to user
    const agent = await Agent.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Check if provider is configured
    if (!isProviderConfigured(agent.provider)) {
      return NextResponse.json(
        { error: `${agent.provider} provider not configured` },
        { status: 400 }
      );
    }

    // Check if agent has a provider ID (required for making calls)
    if (!agent.providerAgentId) {
      return NextResponse.json(
        { error: "Agent not synced with provider. Please save the agent first." },
        { status: 400 }
      );
    }

    // Get the provider module
    const provider = getProvider(agent.provider);

    // Create call record in database
    const call = await Call.create({
      agentId: agent._id,
      userId: session.user.id,
      provider: agent.provider,
      status: "pending",
    });

    let callCredentials = {};

    // Get call credentials from provider
    if (agent.provider === "retell") {
      // Retell: Register web call to get access token
      const result = await provider.registerCall(agent.providerAgentId);
      callCredentials = {
        accessToken: result.accessToken,
        providerCallId: result.callId,
      };
      call.providerCallId = result.callId;
      await call.save();
    } else if (agent.provider === "elevenlabs") {
      // ElevenLabs: Get signed WebSocket URL
      const result = await provider.getSignedUrl(agent.providerAgentId);
      callCredentials = {
        signedUrl: result.signedUrl,
      };
    } else if (agent.provider === "vapi") {
      // Vapi: Uses public key directly, no server registration needed
      // Just return the assistant ID
      callCredentials = {
        assistantId: agent.providerAgentId,
      };
    }

    return NextResponse.json(
      {
        call: {
          id: call._id.toString(),
          agentId: call.agentId.toString(),
          provider: call.provider,
          status: call.status,
          providerCallId: call.providerCallId,
        },
        credentials: callCredentials,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("Error starting call:", e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

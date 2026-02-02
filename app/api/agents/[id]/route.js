import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import Agent from "@/models/Agent";

// Helper to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
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

    return NextResponse.json(agent.toJSON());
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
    if (body.provider) {
      const validProviders = ["retell", "vapi", "elevenlabs"];
      if (!validProviders.includes(body.provider)) {
        return NextResponse.json(
          { error: "Invalid provider. Must be retell, vapi, or elevenlabs" },
          { status: 400 }
        );
      }
    }

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
        agent[field] = body[field];
      }
    }

    await agent.save();

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

    await Agent.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

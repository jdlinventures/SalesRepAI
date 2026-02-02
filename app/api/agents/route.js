import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import Agent from "@/models/Agent";

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

    // Transform _id to id for each agent
    const transformedAgents = agents.map((agent) => ({
      ...agent,
      id: agent._id.toString(),
      _id: undefined,
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

    // Create the agent
    const agent = await Agent.create({
      userId: session.user.id,
      name: body.name,
      provider: body.provider,
      systemPrompt: body.systemPrompt,
      firstMessage: body.firstMessage,
      knowledgeBase: body.knowledgeBase || [],
      voiceId: body.voiceId,
      voiceName: body.voiceName,
      llmModel: body.llmModel || "gpt-4",
      language: body.language || "en-US",
    });

    return NextResponse.json(agent.toJSON(), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

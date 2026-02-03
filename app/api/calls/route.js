import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import Call from "@/models/Call";
import Agent from "@/models/Agent";

// GET /api/calls - List all calls for authenticated user
export async function GET(req) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Get all calls for the user with agent info
    const calls = await Call.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    // Get agent IDs from calls
    const agentIds = [...new Set(calls.map((c) => c.agentId?.toString()).filter(Boolean))];

    // Fetch agents
    const agents = await Agent.find({ _id: { $in: agentIds } })
      .select("name provider")
      .lean();

    // Create agent lookup map
    const agentMap = {};
    for (const agent of agents) {
      agentMap[agent._id.toString()] = {
        id: agent._id.toString(),
        name: agent.name,
        provider: agent.provider,
      };
    }

    // Transform calls with agent info
    const transformedCalls = calls.map((call) => ({
      id: call._id.toString(),
      agentId: call.agentId?.toString(),
      agent: agentMap[call.agentId?.toString()] || null,
      provider: call.provider,
      status: call.status,
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      duration: call.duration,
      transcriptLength: call.transcript?.length || 0,
      endReason: call.endReason,
      createdAt: call.createdAt,
    }));

    // Get total count for pagination
    const total = await Call.countDocuments({ userId: session.user.id });

    return NextResponse.json({
      calls: transformedCalls,
      total,
      limit,
      offset,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

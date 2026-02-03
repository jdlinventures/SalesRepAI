import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import Call from "@/models/Call";
import Agent from "@/models/Agent";

// GET /api/calls/[id] - Get a specific call with full transcript
export async function GET(req, { params }) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await connectMongo();

    const { id } = await params;

    const call = await Call.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    // Get agent info
    let agent = null;
    if (call.agentId) {
      const agentDoc = await Agent.findById(call.agentId)
        .select("name provider voiceName")
        .lean();
      if (agentDoc) {
        agent = {
          id: agentDoc._id.toString(),
          name: agentDoc.name,
          provider: agentDoc.provider,
          voiceName: agentDoc.voiceName,
        };
      }
    }

    return NextResponse.json({
      id: call._id.toString(),
      agentId: call.agentId?.toString(),
      agent,
      provider: call.provider,
      status: call.status,
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      duration: call.duration,
      transcript: call.transcript || [],
      endReason: call.endReason,
      errorMessage: call.errorMessage,
      recordingUrl: call.recordingUrl || null,
      estimatedCost: call.estimatedCost || null,
      llmModel: call.llmModel || "gpt-4o",
      createdAt: call.createdAt,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

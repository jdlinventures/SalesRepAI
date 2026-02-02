import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import Agent from "@/models/Agent";
import Call from "@/models/Call";

// GET /api/agents/[id]/calls/[callId] - Get a specific call
export async function GET(req, { params }) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await connectMongo();
    const { id, callId } = await params;

    // Verify agent exists and belongs to user
    const agent = await Agent.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Fetch the specific call
    const call = await Call.findOne({
      _id: callId,
      agentId: id,
      userId: session.user.id,
    }).lean();

    if (!call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...call,
      id: call._id.toString(),
      _id: undefined,
      agentId: call.agentId.toString(),
      userId: undefined,
    });
  } catch (e) {
    console.error("Error fetching call:", e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

// PATCH /api/agents/[id]/calls/[callId] - Update call status/transcript
export async function PATCH(req, { params }) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await connectMongo();
    const { id, callId } = await params;
    const body = await req.json();

    // Verify agent exists and belongs to user
    const agent = await Agent.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Fetch and update the call
    const call = await Call.findOne({
      _id: callId,
      agentId: id,
      userId: session.user.id,
    });

    if (!call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    // Update allowed fields
    const allowedUpdates = [
      "status",
      "startedAt",
      "endedAt",
      "duration",
      "transcript",
      "endReason",
      "errorMessage",
      "providerCallId",
    ];

    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        call[field] = body[field];
      }
    }

    // If call ended, update agent usage stats
    if (body.status === "ended" && body.duration) {
      agent.lastUsedAt = new Date();
      agent.totalCalls = (agent.totalCalls || 0) + 1;
      agent.totalDuration = (agent.totalDuration || 0) + body.duration;
      await agent.save();
    }

    await call.save();

    return NextResponse.json({
      ...call.toJSON(),
      agentId: call.agentId.toString(),
      userId: undefined,
    });
  } catch (e) {
    console.error("Error updating call:", e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

// DELETE /api/agents/[id]/calls/[callId] - Delete a call
export async function DELETE(req, { params }) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await connectMongo();
    const { id, callId } = await params;

    // Verify agent exists and belongs to user
    const agent = await Agent.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Delete the call
    const result = await Call.deleteOne({
      _id: callId,
      agentId: id,
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error deleting call:", e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

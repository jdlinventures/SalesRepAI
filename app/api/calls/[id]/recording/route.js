import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import Call from "@/models/Call";
import { getCallDetails } from "@/libs/providers/retell";
import { calculateCost } from "@/libs/pricing";

// POST /api/calls/[id]/recording - Fetch recording from provider and update call
export async function POST(req, { params }) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    await connectMongo();

    const { id } = await params;

    // Get the call
    const call = await Call.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    // Only fetch for ended calls
    if (call.status !== "ended") {
      return NextResponse.json(
        { error: "Call must be ended to fetch recording" },
        { status: 400 }
      );
    }

    // Check if we already have the recording
    if (call.recordingUrl) {
      return NextResponse.json({
        recordingUrl: call.recordingUrl,
        estimatedCost: call.estimatedCost,
      });
    }

    // Only Retell is supported for now
    if (call.provider !== "retell") {
      return NextResponse.json(
        { error: "Recording not available for this provider" },
        { status: 400 }
      );
    }

    // Need the provider call ID
    if (!call.providerCallId) {
      return NextResponse.json(
        { error: "Provider call ID not found" },
        { status: 400 }
      );
    }

    // Fetch call details from Retell
    const details = await getCallDetails(call.providerCallId);

    console.log("[Recording API] Details from Retell:", {
      recordingUrl: details.recordingUrl,
      hasRecordingUrl: !!details.recordingUrl,
      transcript: typeof details.transcript,
    });

    // Calculate estimated cost
    const estimatedCost = calculateCost(
      call.duration,
      call.provider,
      call.llmModel || "gpt-4o"
    );

    console.log("[Recording API] Calculated cost:", {
      duration: call.duration,
      provider: call.provider,
      llmModel: call.llmModel,
      estimatedCost,
    });

    // Build update object - only include fields that have valid values
    const updateData = {
      estimatedCost: estimatedCost,
    };

    // Only update recording URL if Retell actually has one
    if (details.recordingUrl) {
      updateData.recordingUrl = details.recordingUrl;
    }

    console.log("[Recording API] Update data:", updateData);

    // Also update transcript if Retell has a better one (array format with content)
    if (details.transcript) {
      if (Array.isArray(details.transcript) && details.transcript.length > 0) {
        // Transcript is an array of objects
        updateData.transcript = details.transcript.map((entry) => ({
          role: entry.role === "agent" ? "agent" : "user",
          content: entry.content || "",
          timestamp: new Date(),
        }));
      }
      // If transcript is a string, we keep the existing transcript from our real-time capture
      // since it's already in the right format
    }

    // Use findOneAndUpdate to avoid version conflicts
    const updatedCall = await Call.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: updateData },
      { new: true, lean: true } // lean: true returns plain JS object
    );

    if (!updatedCall) {
      return NextResponse.json({ error: "Failed to update call" }, { status: 500 });
    }

    // Use the values we know we set, falling back to what's in the document
    const recordingUrl = updateData.recordingUrl || updatedCall.recordingUrl || null;
    const finalEstimatedCost = updateData.estimatedCost ?? updatedCall.estimatedCost ?? null;

    console.log("[Recording API] Returning:", {
      recordingUrl: recordingUrl?.substring(0, 50),
      estimatedCost: finalEstimatedCost,
      transcriptLength: updatedCall.transcript?.length,
    });

    return NextResponse.json({
      recordingUrl,
      estimatedCost: finalEstimatedCost,
      transcript: updatedCall.transcript,
      recordingPending: !recordingUrl,
    });
  } catch (e) {
    console.error("Error fetching recording:", e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

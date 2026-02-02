"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
import CallTranscript from "./CallTranscript";

// Past calls list and detail view
const CallHistory = ({ agentId, onClose }) => {
  const [calls, setCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  // Fetch call history
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const data = await apiClient.get(`/agents/${agentId}/calls`);
        setCalls(data);
      } catch (e) {
        console.error("Failed to fetch call history:", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (agentId) {
      fetchCalls();
    }
  }, [agentId]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Format transcript as text
  const formatTranscriptAsText = (transcript) => {
    if (!transcript || transcript.length === 0) return "No transcript available.";
    return transcript
      .map((entry) => `${entry.role === "user" ? "You" : "Agent"}: ${entry.content}`)
      .join("\n\n");
  };

  // Copy transcript to clipboard
  const handleCopyTranscript = async () => {
    if (!selectedCall?.transcript) return;
    const text = formatTranscriptAsText(selectedCall.transcript);
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Transcript copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy transcript");
    }
  };

  // Download transcript as text file
  const handleDownloadTranscript = () => {
    if (!selectedCall?.transcript) return;
    const text = formatTranscriptAsText(selectedCall.transcript);
    const date = formatDate(selectedCall.startedAt || selectedCall.createdAt).replace(/[/:]/g, "-");
    const filename = `transcript-${date}.txt`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Transcript downloaded");
  };

  // Delete a call
  const handleDelete = async (callId, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this call?")) return;

    setIsDeleting(callId);
    try {
      await apiClient.delete(`/agents/${agentId}/calls/${callId}`);
      setCalls(calls.filter((c) => c.id !== callId));
      if (selectedCall?.id === callId) {
        setSelectedCall(null);
      }
    } catch (e) {
      console.error("Failed to delete call:", e);
    } finally {
      setIsDeleting(null);
    }
  };

  // Status badge
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      "in-progress": "bg-[#DCFCE7] text-[#166534]",
      ended: "bg-[#F4F4F5] text-[#52525B]",
      failed: "bg-[#FEE2E2] text-[#991B1B]",
      pending: "bg-[#FEF3C7] text-[#92400E]",
      ringing: "bg-[#DBEAFE] text-[#1E40AF]",
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${statusStyles[status] || "bg-[#F4F4F5] text-[#52525B]"}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="loading-spinner" />
      </div>
    );
  }

  // Show call detail view
  if (selectedCall) {
    const hasTranscript = selectedCall.transcript && selectedCall.transcript.length > 0;

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCall(null)}
            className="btn btn-ghost btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Back
          </button>
          <h3 className="text-[15px] font-semibold text-[#18181B]">Call Details</h3>
        </div>

        <div className="bg-[#FAFAFA] border border-[#E4E4E7] p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-[#71717A]">Date</span>
            <span className="text-[13px] text-[#18181B]">{formatDate(selectedCall.startedAt || selectedCall.createdAt)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-[#71717A]">Duration</span>
            <span className="text-[13px] text-[#18181B]">{formatDuration(selectedCall.duration)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-[#71717A]">Status</span>
            <StatusBadge status={selectedCall.status} />
          </div>
          {selectedCall.endReason && (
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#71717A]">End Reason</span>
              <span className="text-[13px] text-[#18181B]">{selectedCall.endReason}</span>
            </div>
          )}
          {selectedCall.errorMessage && (
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#71717A]">Error</span>
              <span className="text-[13px] text-[#DC2626]">{selectedCall.errorMessage}</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[14px] font-medium text-[#18181B]">Transcript</h4>
            {hasTranscript && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopyTranscript}
                  className="btn btn-ghost btn-sm"
                  title="Copy transcript"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  </svg>
                  Copy
                </button>
                <button
                  onClick={handleDownloadTranscript}
                  className="btn btn-ghost btn-sm"
                  title="Download transcript"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Download
                </button>
              </div>
            )}
          </div>
          <CallTranscript transcript={selectedCall.transcript} isLive={false} />
        </div>
      </div>
    );
  }

  // Show call list
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[#18181B]">Call History</h3>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-[#F4F4F5] transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-[#71717A]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {calls.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-12 h-12 rounded-xl bg-[#F4F4F5] flex items-center justify-center mx-auto mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#A1A1AA]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
          </div>
          <p className="text-[14px] text-[#71717A]">No call history yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {calls.map((call) => (
            <div
              key={call.id}
              onClick={() => setSelectedCall(call)}
              className="flex items-center justify-between p-3 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl hover:bg-[#F4F4F5] cursor-pointer transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[#18181B]">
                    {formatDate(call.startedAt || call.createdAt)}
                  </span>
                  <StatusBadge status={call.status} />
                </div>
                <div className="text-[12px] text-[#A1A1AA] mt-1">
                  Duration: {formatDuration(call.duration)} | {call.transcript?.length || 0} messages
                </div>
              </div>
              <button
                onClick={(e) => handleDelete(call.id, e)}
                disabled={isDeleting === call.id}
                className="p-1.5 rounded-md text-[#71717A] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
              >
                {isDeleting === call.id ? (
                  <div className="loading-spinner !w-4 !h-4" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CallHistory;

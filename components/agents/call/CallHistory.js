"use client";

import { useState, useEffect } from "react";
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
      "in-progress": "badge-success",
      ended: "badge-ghost",
      failed: "badge-error",
      pending: "badge-warning",
      ringing: "badge-info",
    };

    return (
      <span className={`badge badge-sm ${statusStyles[status] || "badge-ghost"}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Show call detail view
  if (selectedCall) {
    return (
      <div className="space-y-4">
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
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Back
          </button>
          <h3 className="font-semibold">Call Details</h3>
        </div>

        <div className="bg-base-200 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-base-content/60">Date</span>
            <span>{formatDate(selectedCall.startedAt || selectedCall.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Duration</span>
            <span>{formatDuration(selectedCall.duration)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Status</span>
            <StatusBadge status={selectedCall.status} />
          </div>
          {selectedCall.endReason && (
            <div className="flex justify-between">
              <span className="text-base-content/60">End Reason</span>
              <span>{selectedCall.endReason}</span>
            </div>
          )}
          {selectedCall.errorMessage && (
            <div className="flex justify-between">
              <span className="text-base-content/60">Error</span>
              <span className="text-error">{selectedCall.errorMessage}</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-2">Transcript</h4>
          <CallTranscript transcript={selectedCall.transcript} isLive={false} />
        </div>
      </div>
    );
  }

  // Show call list
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Call History</h3>
        {onClose && (
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
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
        <div className="text-center py-8 text-base-content/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mx-auto mb-2 opacity-50"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
          <p>No call history yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {calls.map((call) => (
            <div
              key={call.id}
              onClick={() => setSelectedCall(call)}
              className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatDate(call.startedAt || call.createdAt)}
                  </span>
                  <StatusBadge status={call.status} />
                </div>
                <div className="text-xs text-base-content/60 mt-1">
                  Duration: {formatDuration(call.duration)} |{" "}
                  {call.transcript?.length || 0} messages
                </div>
              </div>
              <button
                onClick={(e) => handleDelete(call.id, e)}
                disabled={isDeleting === call.id}
                className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/20"
              >
                {isDeleting === call.id ? (
                  <span className="loading loading-spinner loading-xs"></span>
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

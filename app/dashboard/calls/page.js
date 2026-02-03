"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/libs/api";

const providerLabels = {
  retell: "Retell AI",
  vapi: "Vapi",
  elevenlabs: "ElevenLabs",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  ringing: "bg-blue-100 text-blue-800",
  "in-progress": "bg-green-100 text-green-800",
  ended: "bg-gray-100 text-gray-800",
  failed: "bg-red-100 text-red-800",
};

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const CallRow = ({ call, onClick }) => (
  <tr
    onClick={() => onClick(call)}
    className="border-b border-[#E4E4E7] hover:bg-[#FAFAFA] cursor-pointer transition-colors"
  >
    <td className="py-4 px-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#F4F4F5] flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-[#71717A]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
        </div>
        <div>
          <p className="text-[14px] font-medium text-[#18181B]">
            {call.agent?.name || "Unknown Agent"}
          </p>
          <p className="text-[12px] text-[#A1A1AA]">
            {providerLabels[call.provider] || call.provider}
          </p>
        </div>
      </div>
    </td>
    <td className="py-4 px-4">
      <span className="text-[13px] text-[#52525B]">{formatDate(call.createdAt)}</span>
    </td>
    <td className="py-4 px-4">
      <span className="text-[13px] text-[#52525B] font-mono">
        {formatDuration(call.duration)}
      </span>
    </td>
    <td className="py-4 px-4">
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
          statusColors[call.status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {call.status}
      </span>
    </td>
    <td className="py-4 px-4">
      <span className="text-[13px] text-[#71717A]">
        {call.transcriptLength} messages
      </span>
    </td>
    <td className="py-4 px-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4 text-[#D4D4D8]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </td>
  </tr>
);

const CallDetailModal = ({ call, onClose }) => {
  const [fullCall, setFullCall] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCall = async () => {
      try {
        const data = await apiClient.get(`/calls/${call.id}`);
        setFullCall(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCall();
  }, [call.id]);

  const formatTranscript = () => {
    if (!fullCall?.transcript?.length) return "No transcript available.";
    return fullCall.transcript
      .map((entry) => `${entry.role === "user" ? "You" : "Agent"}: ${entry.content}`)
      .join("\n\n");
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(formatTranscript());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E4E4E7]">
          <div>
            <h2 className="text-[17px] font-semibold text-[#18181B]">
              Call with {call.agent?.name || "Unknown Agent"}
            </h2>
            <p className="text-[13px] text-[#71717A] mt-0.5">
              {formatDate(call.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg hover:bg-[#F4F4F5] transition-colors"
          >
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
        </div>

        {/* Call info */}
        <div className="grid grid-cols-3 gap-4 p-5 border-b border-[#E4E4E7] bg-[#FAFAFA]">
          <div>
            <p className="text-[12px] text-[#71717A] mb-1">Duration</p>
            <p className="text-[14px] font-medium text-[#18181B] font-mono">
              {formatDuration(call.duration)}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-[#71717A] mb-1">Status</p>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                statusColors[call.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {call.status}
            </span>
          </div>
          <div>
            <p className="text-[12px] text-[#71717A] mb-1">Provider</p>
            <p className="text-[14px] font-medium text-[#18181B]">
              {providerLabels[call.provider] || call.provider}
            </p>
          </div>
        </div>

        {/* Transcript */}
        <div className="flex-1 overflow-auto p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#18181B]">Transcript</h3>
            {fullCall?.transcript?.length > 0 && (
              <button
                onClick={copyTranscript}
                className="text-[12px] text-[#71717A] hover:text-[#18181B] transition-colors flex items-center gap-1.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
                Copy
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="loading-spinner" />
            </div>
          ) : fullCall?.transcript?.length > 0 ? (
            <div className="space-y-4">
              {fullCall.transcript.map((entry, index) => (
                <div
                  key={index}
                  className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                      entry.role === "user"
                        ? "bg-[#18181B] text-white rounded-br-md"
                        : "bg-[#F4F4F5] text-[#18181B] rounded-bl-md"
                    }`}
                  >
                    <p className="text-[13px] leading-relaxed">{entry.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-[#71717A] text-center py-10">
              No transcript available for this call.
            </p>
          )}
        </div>

        {/* Footer */}
        {call.agent && (
          <div className="p-4 border-t border-[#E4E4E7]">
            <Link
              href={`/dashboard/agents/${call.agentId}/call`}
              className="btn btn-primary w-full"
            >
              Call Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-14 h-14 rounded-xl bg-[#F4F4F5] flex items-center justify-center mx-auto mb-5">
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
    <h3 className="text-[15px] font-semibold text-[#18181B] mb-2">No calls yet</h3>
    <p className="text-[13px] text-[#71717A] mb-5">
      Start a call with one of your agents to see your call history here.
    </p>
    <Link href="/dashboard/agents" className="btn btn-primary">
      View Agents
    </Link>
  </div>
);

export default function CallHistoryPage() {
  const [calls, setCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const data = await apiClient.get("/calls");
      setCalls(data.calls || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-h2 mb-1">Call History</h1>
        <p className="text-body-sm">View and review your past calls and transcripts.</p>
      </div>

      {calls.length === 0 ? (
        <div className="card-flat">
          <EmptyState />
        </div>
      ) : (
        <div className="card-flat overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E4E4E7] bg-[#FAFAFA]">
                <th className="py-3 px-4 text-left text-[12px] font-semibold text-[#71717A] uppercase tracking-wider">
                  Agent
                </th>
                <th className="py-3 px-4 text-left text-[12px] font-semibold text-[#71717A] uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-[12px] font-semibold text-[#71717A] uppercase tracking-wider">
                  Duration
                </th>
                <th className="py-3 px-4 text-left text-[12px] font-semibold text-[#71717A] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-[12px] font-semibold text-[#71717A] uppercase tracking-wider">
                  Transcript
                </th>
                <th className="py-3 px-4 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => (
                <CallRow key={call.id} call={call} onClick={setSelectedCall} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCall && (
        <CallDetailModal call={selectedCall} onClose={() => setSelectedCall(null)} />
      )}
    </div>
  );
}

"use client";

import CallTimer from "./CallTimer";
import { calculateCost, formatCost } from "@/libs/pricing";

// Status indicator with visual feedback
const CallStatus = ({ status, duration, provider, llmModel }) => {
  const statusConfig = {
    idle: {
      text: "Ready to call",
      color: "text-[#71717A]",
      dotColor: "bg-[#D4D4D8]",
      pulse: false,
    },
    connecting: {
      text: "Connecting...",
      color: "text-[#F59E0B]",
      dotColor: "bg-[#F59E0B]",
      pulse: true,
    },
    ringing: {
      text: "Ringing...",
      color: "text-[#3B82F6]",
      dotColor: "bg-[#3B82F6]",
      pulse: true,
    },
    "in-progress": {
      text: "In Call",
      color: "text-[#22C55E]",
      dotColor: "bg-[#22C55E]",
      pulse: true,
    },
    ended: {
      text: "Call Ended",
      color: "text-[#71717A]",
      dotColor: "bg-[#D4D4D8]",
      pulse: false,
    },
    failed: {
      text: "Call Failed",
      color: "text-[#DC2626]",
      dotColor: "bg-[#DC2626]",
      pulse: false,
    },
  };

  const config = statusConfig[status] || statusConfig.idle;

  // Calculate estimated cost
  const estimatedCost = calculateCost(duration, provider || "retell", llmModel || "gpt-4o");

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Status indicator dot */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
          {config.pulse && (
            <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping ${config.dotColor} opacity-75`} />
          )}
        </div>
        <span className={`text-[14px] font-medium ${config.color}`}>{config.text}</span>
      </div>

      {/* Timer and cost - show during call or after ended */}
      {(status === "in-progress" || status === "ended") && (
        <div className="flex flex-col items-center gap-2">
          <CallTimer duration={duration} />
          {/* Cost meter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F4F5] border border-[#E4E4E7]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 text-[#71717A]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-[12px] font-medium text-[#52525B]">
              Est. {formatCost(estimatedCost)}
            </span>
          </div>
        </div>
      )}

      {/* Connecting animation */}
      {(status === "connecting" || status === "ringing") && (
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#D4D4D8] animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-[#D4D4D8] animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-[#D4D4D8] animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      )}
    </div>
  );
};

export default CallStatus;

"use client";

import CallTimer from "./CallTimer";

// Status indicator with visual feedback
const CallStatus = ({ status, duration }) => {
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

      {/* Timer - show during call or after ended */}
      {(status === "in-progress" || status === "ended") && (
        <CallTimer duration={duration} />
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

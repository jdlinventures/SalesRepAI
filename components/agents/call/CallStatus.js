"use client";

import CallTimer from "./CallTimer";

// Status indicator with visual feedback
const CallStatus = ({ status, duration }) => {
  const statusConfig = {
    idle: {
      text: "Ready to call",
      color: "text-base-content/60",
      pulse: false,
    },
    connecting: {
      text: "Connecting...",
      color: "text-warning",
      pulse: true,
    },
    ringing: {
      text: "Ringing...",
      color: "text-info",
      pulse: true,
    },
    "in-progress": {
      text: "In Call",
      color: "text-success",
      pulse: true,
    },
    ended: {
      text: "Call Ended",
      color: "text-base-content/60",
      pulse: false,
    },
    failed: {
      text: "Call Failed",
      color: "text-error",
      pulse: false,
    },
  };

  const config = statusConfig[status] || statusConfig.idle;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Status indicator dot */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <div
            className={`w-3 h-3 rounded-full ${
              status === "in-progress"
                ? "bg-success"
                : status === "connecting" || status === "ringing"
                ? "bg-warning"
                : status === "failed"
                ? "bg-error"
                : "bg-base-content/30"
            }`}
          />
          {config.pulse && (
            <div
              className={`absolute inset-0 w-3 h-3 rounded-full animate-ping ${
                status === "in-progress"
                  ? "bg-success"
                  : status === "connecting" || status === "ringing"
                  ? "bg-warning"
                  : ""
              }`}
            />
          )}
        </div>
        <span className={`font-medium ${config.color}`}>{config.text}</span>
      </div>

      {/* Timer - show during call or after ended */}
      {(status === "in-progress" || status === "ended") && (
        <CallTimer duration={duration} />
      )}

      {/* Connecting animation */}
      {(status === "connecting" || status === "ringing") && (
        <span className="loading loading-dots loading-md"></span>
      )}
    </div>
  );
};

export default CallStatus;

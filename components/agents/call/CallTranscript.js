"use client";

import { useEffect, useRef } from "react";

// Real-time transcript display
const CallTranscript = ({ transcript, isLive = false }) => {
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current && isLive) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript, isLive]);

  if (!transcript || transcript.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-base-content/50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 mb-2 opacity-50"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        <p>Transcript will appear here</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-3 h-64 overflow-y-auto p-4 bg-base-200 rounded-lg"
    >
      {transcript.map((entry, index) => (
        <div
          key={index}
          className={`flex flex-col ${
            entry.role === "user" ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-lg ${
              entry.role === "user"
                ? "bg-primary text-primary-content rounded-br-none"
                : "bg-base-100 rounded-bl-none"
            } ${entry.interim ? "opacity-60" : ""}`}
          >
            <div className="text-xs font-medium mb-1 opacity-70">
              {entry.role === "user" ? "You" : "Agent"}
            </div>
            <p className="text-sm">{entry.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CallTranscript;

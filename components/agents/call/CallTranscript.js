"use client";

import { useEffect, useRef } from "react";

// Real-time transcript display
const CallTranscript = ({ transcript, isLive = false }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  if (!transcript || transcript.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-base-content/40 bg-base-200/50 rounded-xl border border-base-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-16 h-16 mb-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
        <p className="text-sm">Conversation will appear here</p>
        {isLive && (
          <p className="text-xs mt-1 opacity-60">Listening...</p>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-4 h-72 overflow-y-auto p-4 bg-base-200/50 rounded-xl border border-base-300"
    >
      {transcript.map((entry, index) => (
        <div
          key={index}
          className={`flex ${
            entry.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[85%] ${
              entry.interim ? "opacity-50" : ""
            }`}
          >
            {/* Speaker label */}
            <div
              className={`text-xs font-semibold mb-1 px-1 ${
                entry.role === "user"
                  ? "text-right text-primary"
                  : "text-left text-secondary"
              }`}
            >
              {entry.role === "user" ? "You" : "Agent"}
            </div>

            {/* Message bubble */}
            <div
              className={`px-4 py-3 rounded-2xl shadow-sm ${
                entry.role === "user"
                  ? "bg-primary text-primary-content rounded-tr-sm"
                  : "bg-base-100 text-base-content rounded-tl-sm border border-base-300"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Invisible element to scroll to */}
      <div ref={bottomRef} />
    </div>
  );
};

export default CallTranscript;

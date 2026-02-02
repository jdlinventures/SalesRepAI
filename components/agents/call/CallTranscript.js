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
      <div className="flex flex-col items-center justify-center h-72 bg-[#FAFAFA] rounded-xl border border-[#E4E4E7]">
        <div className="w-14 h-14 rounded-xl bg-[#F4F4F5] flex items-center justify-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 text-[#A1A1AA]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        </div>
        <p className="text-[14px] text-[#71717A]">Conversation will appear here</p>
        {isLive && (
          <p className="text-[12px] text-[#A1A1AA] mt-1">Listening...</p>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-3 h-72 overflow-y-auto p-4 bg-[#FAFAFA] rounded-xl border border-[#E4E4E7] text-left"
    >
      {transcript.map((entry, index) => {
        const isUser = entry.role === "user";
        return (
          <div
            key={index}
            className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] ${entry.interim ? "opacity-50" : ""}`}
            >
              {/* Speaker label */}
              <div
                className={`text-[11px] font-medium mb-1 uppercase tracking-wide ${
                  isUser ? "text-right text-[#18181B]" : "text-left text-[#71717A]"
                }`}
              >
                {isUser ? "You" : "Agent"}
              </div>

              {/* Message bubble */}
              <div
                className={`px-4 py-2.5 rounded-xl ${
                  isUser
                    ? "bg-[#18181B] text-white rounded-br-md"
                    : "bg-white text-[#18181B] rounded-bl-md border border-[#E4E4E7]"
                }`}
              >
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Invisible element to scroll to */}
      <div ref={bottomRef} />
    </div>
  );
};

export default CallTranscript;

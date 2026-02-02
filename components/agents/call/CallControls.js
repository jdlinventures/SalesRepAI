"use client";

// Call control buttons (start/end/mute)
const CallControls = ({
  status,
  isMuted,
  onStartCall,
  onEndCall,
  onToggleMute,
  onReset,
  isDisabled = false,
}) => {
  const isIdle = status === "idle";
  const isConnecting = status === "connecting" || status === "ringing";
  const isInProgress = status === "in-progress";
  const isActive = isConnecting || isInProgress;
  const isEnded = status === "ended" || status === "failed";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Start Call Button - show when idle */}
      {isIdle && (
        <button
          onClick={onStartCall}
          disabled={isDisabled}
          className="btn btn-primary btn-lg gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
          Start Call
        </button>
      )}

      {/* Active call controls - mute and end */}
      {isActive && (
        <div className="flex items-center gap-3">
          {/* Mute Button - only show when in-progress */}
          {isInProgress && (
            <button
              onClick={onToggleMute}
              className={`btn btn-circle btn-lg ${
                isMuted ? "btn-warning" : "btn-ghost border-base-300"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                // Muted icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 19L5 5m14 0v5.586c0 .89-.963 1.448-1.72.998l-3.005-1.789M12 18.75a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25c0 .17-.014.337-.042.5"
                  />
                </svg>
              ) : (
                // Unmuted icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              )}
            </button>
          )}

          {/* End Call Button */}
          <button onClick={onEndCall} className="btn btn-error btn-lg gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 3.75L18 6m0 0l2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.055.902-.417 1.173l-1.293.97a.077.077 0 00-.013.018c-.162.441-.162.928.113 1.39a12.036 12.036 0 007.13 7.13c.462.275.949.275 1.39.113a.077.077 0 00.018-.013l.97-1.293c.271-.362.733-.527 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z"
              />
            </svg>
            {isConnecting ? "Cancel" : "End Call"}
          </button>
        </div>
      )}

      {/* Muted indicator */}
      {isInProgress && isMuted && (
        <p className="text-sm text-warning font-medium">Microphone muted</p>
      )}

      {/* New Call Button - show after call ended */}
      {isEnded && (
        <button onClick={onReset} className="btn btn-primary btn-lg gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          New Call
        </button>
      )}
    </div>
  );
};

export default CallControls;

"use client";

// Call duration timer display
const CallTimer = ({ duration }) => {
  // Format seconds to MM:SS or HH:MM:SS
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-2xl font-mono font-semibold tabular-nums">
      {formatDuration(duration)}
    </div>
  );
};

export default CallTimer;

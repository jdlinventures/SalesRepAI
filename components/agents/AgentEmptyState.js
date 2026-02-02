"use client";

import Link from "next/link";

const AgentEmptyState = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </div>

      <h3 className="text-h3 mb-2">No agents yet</h3>
      <p className="text-body-sm max-w-[360px] mb-8">
        Create your first AI voice agent to start making and receiving calls.
        Configure voice, personality, and knowledge base.
      </p>

      <Link href="/dashboard/agents/new" className="btn btn-primary">
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Create Your First Agent
      </Link>
    </div>
  );
};

export default AgentEmptyState;

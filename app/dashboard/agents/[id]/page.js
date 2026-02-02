"use client";

import { use } from "react";
import Link from "next/link";
import AgentBuilder from "@/components/agents/AgentBuilder";

export default function EditAgentPage({ params }) {
  const { id } = use(params);

  return (
    <div className="p-6 lg:p-8 max-w-[800px] mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[13px] text-[#71717A] mb-4">
          <Link href="/dashboard/agents" className="hover:text-[#18181B] transition-colors">
            Agents
          </Link>
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
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          <span className="text-[#18181B]">Edit Agent</span>
        </div>
        <h1 className="text-h2 mb-1">Edit Agent</h1>
        <p className="text-body-sm">
          Update your AI voice agent's configuration.
        </p>
      </div>

      <div className="card-flat p-6">
        <AgentBuilder agentId={id} />
      </div>
    </div>
  );
}

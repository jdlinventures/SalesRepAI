"use client";

import { use } from "react";
import Link from "next/link";
import AgentBuilder from "@/components/agents/AgentBuilder";

export default function EditAgentPage({ params }) {
  const { id } = use(params);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
          <Link href="/dashboard/agents" className="hover:text-primary">
            Agents
          </Link>
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
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          <span>Edit Agent</span>
        </div>
        <h1 className="text-2xl font-bold">Edit Agent</h1>
        <p className="text-base-content/60 mt-1">
          Update your AI voice agent's configuration.
        </p>
      </div>

      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body">
          <AgentBuilder agentId={id} />
        </div>
      </div>
    </div>
  );
}

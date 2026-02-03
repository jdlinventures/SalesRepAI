"use client";

import { use } from "react";
import Link from "next/link";
import CallInterface from "@/components/agents/call/CallInterface";

export default function CallPage({ params }) {
  const { id } = use(params);

  return (
    <div className="p-6 lg:p-8 max-w-[800px] mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard/agents"
        className="inline-flex items-center gap-1.5 text-[13px] text-[#71717A] hover:text-[#18181B] transition-colors mb-6"
      >
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
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to Agents
      </Link>

      <CallInterface agentId={id} />
    </div>
  );
}

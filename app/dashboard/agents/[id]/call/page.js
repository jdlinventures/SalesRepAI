"use client";

import { use } from "react";
import CallInterface from "@/components/agents/call/CallInterface";

export default function CallTestingPage({ params }) {
  const { id } = use(params);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Test Call</h1>
        <p className="text-base-content/60">
          Test your AI agent with a live voice call
        </p>
      </div>

      <CallInterface agentId={id} />
    </div>
  );
}

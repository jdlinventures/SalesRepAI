"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/libs/api";
import useCall from "@/hooks/useCall";
import CallStatus from "./CallStatus";
import CallControls from "./CallControls";
import CallTranscript from "./CallTranscript";
import CallHistory from "./CallHistory";

const providerLabels = {
  retell: "Retell AI",
  vapi: "Vapi",
  elevenlabs: "ElevenLabs",
};

// Main call interface container
const CallInterface = ({ agentId }) => {
  const router = useRouter();
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [micPermission, setMicPermission] = useState(null); // null, 'granted', 'denied', 'prompt'

  const {
    status,
    transcript,
    duration,
    error,
    isMuted,
    isConnected,
    isConnecting,
    startCall,
    endCall,
    toggleMute,
    reset,
  } = useCall(agentId);

  // Fetch agent details
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const data = await apiClient.get(`/agents/${agentId}`);
        setAgent(data);
      } catch (e) {
        console.error("Failed to fetch agent:", e);
        router.push("/dashboard/agents");
      } finally {
        setIsLoading(false);
      }
    };

    if (agentId) {
      fetchAgent();
    }
  }, [agentId, router]);

  // Check microphone permission on mount
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: "microphone" });
        setMicPermission(result.state);
        result.onchange = () => setMicPermission(result.state);
      } catch (e) {
        // Permissions API not supported, will check on call start
        setMicPermission("prompt");
      }
    };

    checkMicPermission();
  }, []);

  // Handle start call
  const handleStartCall = () => {
    if (!agent?.provider) return;
    startCall(agent.provider);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center py-12">
        <p className="text-[14px] text-[#DC2626]">Agent not found</p>
      </div>
    );
  }

  // Check if agent can make calls
  const canMakeCall = agent.providerAgentId && micPermission !== "denied";

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h2 mb-1">Call</h1>
            <p className="text-body-sm">
              Start a voice conversation with your AI agent.
            </p>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn btn-ghost"
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
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Call History
          </button>
        </div>
      </div>

      {/* Agent info card */}
      <div className="card-flat p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#71717A]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-[#18181B]">{agent.name}</h2>
            <span className="text-[13px] text-[#71717A]">
              {providerLabels[agent.provider] || agent.provider}
            </span>
          </div>
        </div>
      </div>

      {/* Show history or call interface */}
      {showHistory ? (
        <CallHistory agentId={agentId} onClose={() => setShowHistory(false)} />
      ) : (
        <div className="card-flat p-6">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Warnings */}
            {!agent.providerAgentId && (
              <div className="flex items-center gap-3 w-full p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#F59E0B] flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <span className="text-[13px] text-[#92400E] text-left">Agent not synced with provider. Please edit and save the agent first.</span>
              </div>
            )}

            {micPermission === "denied" && (
              <div className="flex items-center gap-3 w-full p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#DC2626] flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
                <span className="text-[13px] text-[#DC2626] text-left">Microphone access denied. Please enable it in your browser settings.</span>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="flex items-center gap-3 w-full p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#DC2626] flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <span className="text-[13px] text-[#DC2626] text-left">{error}</span>
              </div>
            )}

            {/* Status indicator */}
            <CallStatus
              status={status}
              duration={duration}
              provider={agent?.provider}
              llmModel={agent?.llmModel}
            />

            {/* Transcript */}
            <div className="w-full">
              <CallTranscript transcript={transcript} isLive={isConnected} />
            </div>

            {/* Controls */}
            <CallControls
              status={status}
              isMuted={isMuted}
              onStartCall={handleStartCall}
              onEndCall={endCall}
              onToggleMute={toggleMute}
              onReset={reset}
              isDisabled={!canMakeCall}
            />

            {/* Mic permission prompt */}
            {status === "idle" && micPermission === "prompt" && (
              <p className="text-[13px] text-[#71717A]">
                Microphone access will be requested when you start the call
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default CallInterface;

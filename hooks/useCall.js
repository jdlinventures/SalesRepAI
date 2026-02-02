"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import apiClient from "@/libs/api";
import { createCallClient } from "@/libs/providers/call-clients";

/**
 * Hook for managing call state and lifecycle
 * Handles connection to voice AI providers and real-time transcript updates
 */
export function useCall(agentId) {
  // Call state
  const [status, setStatus] = useState("idle"); // idle, connecting, ringing, in-progress, ended, failed
  const [transcript, setTranscript] = useState([]);
  const [callId, setCallId] = useState(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  // Refs for cleanup and timing
  const clientRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const providerRef = useRef(null);
  const transcriptRef = useRef([]);

  // Keep transcriptRef in sync with transcript state
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Update duration every second while in-progress
  useEffect(() => {
    if (status === "in-progress" && startTimeRef.current) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.destroy();
        clientRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start a new call
  const startCall = useCallback(
    async (provider) => {
      if (!agentId) {
        setError("Agent ID is required");
        return;
      }

      setStatus("connecting");
      setTranscript([]);
      setError(null);
      setDuration(0);
      setIsMuted(false);
      providerRef.current = provider;

      try {
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });

        // Start call via API to get credentials
        const response = await apiClient.post(`/agents/${agentId}/calls`);
        const { call, credentials } = response;

        setCallId(call.id);

        // Create the appropriate call client
        const client = createCallClient(provider);
        clientRef.current = client;

        // Set up event handlers
        client
          .on("call_started", () => {
            setStatus("in-progress");
            startTimeRef.current = Date.now();
            // Update call status in database
            apiClient.patch(`/agents/${agentId}/calls/${call.id}`, {
              status: "in-progress",
              startedAt: new Date().toISOString(),
            });
          })
          .on("call_ended", () => {
            handleCallEnded(call.id);
          })
          .on("transcript", (entries) => {
            setTranscript(entries);
          })
          .on("error", (err) => {
            console.error("Call error:", err);
            setError(err?.message || "Call failed");
            setStatus("failed");
            handleCallFailed(call.id, err?.message);
          });

        // Start the call with provider credentials
        await client.startCall(credentials);
        setStatus("ringing");
      } catch (err) {
        console.error("Failed to start call:", err);
        setError(err?.message || "Failed to start call");
        setStatus("failed");
      }
    },
    [agentId]
  );

  // End the current call
  const endCall = useCallback(async () => {
    if (clientRef.current) {
      try {
        await clientRef.current.endCall();
      } catch (err) {
        console.error("Error ending call:", err);
      }
      clientRef.current.destroy();
      clientRef.current = null;
    }

    if (callId) {
      handleCallEnded(callId);
    }
  }, [callId]);

  // Handle call ended - update database
  const handleCallEnded = useCallback(
    async (id) => {
      setStatus("ended");

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const finalDuration = startTimeRef.current
        ? Math.floor((Date.now() - startTimeRef.current) / 1000)
        : 0;

      setDuration(finalDuration);

      try {
        // Save final transcript and duration to database
        // Use transcriptRef to get the latest transcript value
        await apiClient.patch(`/agents/${agentId}/calls/${id}`, {
          status: "ended",
          endedAt: new Date().toISOString(),
          duration: finalDuration,
          transcript: transcriptRef.current,
          endReason: "user_hangup",
        });
      } catch (err) {
        console.error("Failed to update call record:", err);
      }
    },
    [agentId]
  );

  // Handle call failed - update database
  const handleCallFailed = useCallback(
    async (id, errorMessage) => {
      try {
        await apiClient.patch(`/agents/${agentId}/calls/${id}`, {
          status: "failed",
          errorMessage: errorMessage,
          endedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to update call record:", err);
      }
    },
    [agentId]
  );

  // Toggle mute state
  const toggleMute = useCallback(() => {
    if (clientRef.current && status === "in-progress") {
      const newMutedState = clientRef.current.toggleMute();
      setIsMuted(newMutedState);
    }
  }, [status]);

  // Reset to idle state
  const reset = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.destroy();
      clientRef.current = null;
    }
    setStatus("idle");
    setTranscript([]);
    setCallId(null);
    setDuration(0);
    setError(null);
    setIsMuted(false);
    startTimeRef.current = null;
  }, []);

  return {
    // State
    status,
    transcript,
    callId,
    duration,
    error,
    isMuted,
    isConnected: status === "in-progress",
    isConnecting: status === "connecting" || status === "ringing",
    isEnded: status === "ended" || status === "failed",

    // Actions
    startCall,
    endCall,
    toggleMute,
    reset,
  };
}

export default useCall;

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
import BasicInfoSection from "./AgentForm/BasicInfoSection";
import SystemPromptSection from "./AgentForm/SystemPromptSection";
import ProviderSection from "./AgentForm/ProviderSection";
import VoiceSection from "./AgentForm/VoiceSection";
import KnowledgeBaseSection from "./AgentForm/KnowledgeBaseSection";

const initialFormData = {
  name: "",
  provider: "retell",
  systemPrompt: "",
  firstMessage: "",
  knowledgeBase: [],
  voiceId: "",
  voiceName: "",
  llmModel: "gpt-4",
  language: "en-US",
};

// Main form component for creating and editing agents
const AgentBuilder = ({ agentId = null }) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!agentId);

  const isEditMode = !!agentId;

  // Fetch existing agent data when editing
  useEffect(() => {
    if (agentId) {
      const fetchAgent = async () => {
        try {
          const agent = await apiClient.get(`/agents/${agentId}`);
          setFormData({
            name: agent.name || "",
            provider: agent.provider || "retell",
            systemPrompt: agent.systemPrompt || "",
            firstMessage: agent.firstMessage || "",
            knowledgeBase: agent.knowledgeBase || [],
            voiceId: agent.voiceId || "",
            voiceName: agent.voiceName || "",
            llmModel: agent.llmModel || "gpt-4",
            language: agent.language || "en-US",
          });
        } catch (e) {
          console.error(e);
          router.push("/dashboard/agents");
        } finally {
          setIsFetching(false);
        }
      };
      fetchAgent();
    }
  }, [agentId, router]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Agent name is required";
    }

    if (!formData.provider) {
      newErrors.provider = "Please select a provider";
    }

    if (!formData.systemPrompt.trim()) {
      newErrors.systemPrompt = "System prompt is required";
    }

    if (!formData.firstMessage.trim()) {
      newErrors.firstMessage = "First message is required";
    }

    if (!formData.voiceId) {
      newErrors.voiceId = "Please select a voice";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode) {
        await apiClient.put(`/agents/${agentId}`, formData);
        toast.success("Agent updated successfully");
      } else {
        await apiClient.post("/agents", formData);
        toast.success("Agent created successfully");
      }
      router.push("/dashboard/agents");
    } catch (e) {
      console.error(e);
      // Error toast is handled by apiClient
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <BasicInfoSection
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />

      <div className="h-[1px] bg-[#E4E4E7]" />

      <ProviderSection
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />

      <div className="h-[1px] bg-[#E4E4E7]" />

      <VoiceSection
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />

      <div className="h-[1px] bg-[#E4E4E7]" />

      <SystemPromptSection
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />

      <div className="h-[1px] bg-[#E4E4E7]" />

      <KnowledgeBaseSection formData={formData} setFormData={setFormData} />

      <div className="flex justify-end gap-3 pt-6 border-t border-[#E4E4E7]">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.push("/dashboard/agents")}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading && <div className="loading-spinner !w-4 !h-4 !border-white/30 !border-t-white" />}
          {isEditMode ? "Save Changes" : "Create Agent"}
        </button>
      </div>
    </form>
  );
};

export default AgentBuilder;

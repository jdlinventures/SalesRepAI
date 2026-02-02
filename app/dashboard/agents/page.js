"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
import AgentCard from "@/components/agents/AgentCard";
import AgentEmptyState from "@/components/agents/AgentEmptyState";
import DeleteAgentModal from "@/components/agents/DeleteAgentModal";

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, agent: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const data = await apiClient.get("/agents");
      setAgents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (agent) => {
    setDeleteModal({ isOpen: true, agent });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.agent) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/agents/${deleteModal.agent.id}`);
      setAgents(agents.filter((a) => a.id !== deleteModal.agent.id));
      toast.success("Agent deleted successfully");
      setDeleteModal({ isOpen: false, agent: null });
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClose = () => {
    if (!isDeleting) {
      setDeleteModal({ isOpen: false, agent: null });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h2 mb-1">AI Agents</h1>
          <p className="text-body-sm">
            Create and manage your voice AI agents.
          </p>
        </div>
        {agents.length > 0 && (
          <Link href="/dashboard/agents/new" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Agent
          </Link>
        )}
      </div>

      {/* Agent grid or empty state */}
      {agents.length === 0 ? (
        <AgentEmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <DeleteAgentModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        agent={deleteModal.agent}
        isDeleting={isDeleting}
      />
    </div>
  );
}

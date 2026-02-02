"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import apiClient from "@/libs/api";

export const dynamic = "force-dynamic";

// Stat card with precise spacing
const StatCard = ({ label, value, trend, icon }) => (
  <div className="stat-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value mt-1">{value}</p>
        {trend !== undefined && (
          <p className={`stat-trend ${trend >= 0 ? "stat-trend-up" : "stat-trend-down"}`}>
            {trend >= 0 ? "+" : ""}{trend}% from last week
          </p>
        )}
      </div>
      <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
    </div>
  </div>
);

// Quick action link
const QuickAction = ({ href, icon, iconBg, title, description }) => (
  <Link
    href={href}
    className="flex items-center gap-4 p-4 rounded-xl border border-[#E4E4E7] hover:border-[#D4D4D8] hover:bg-[#FAFAFA] transition-all group"
  >
    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[14px] font-semibold text-[#18181B] group-hover:text-[#18181B]">{title}</p>
      <p className="text-[13px] text-[#71717A]">{description}</p>
    </div>
  </Link>
);

// Recent agent row
const RecentAgentRow = ({ agent }) => (
  <Link
    href={`/dashboard/agents/${agent.id}`}
    className="flex items-center gap-4 p-3 -mx-3 rounded-lg hover:bg-[#F4F4F5] transition-colors group"
  >
    <div className="w-9 h-9 rounded-full bg-[#F4F4F5] flex items-center justify-center flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#71717A]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-medium text-[#18181B] truncate">{agent.name}</p>
      <p className="text-[13px] text-[#A1A1AA]">{agent.totalCalls || 0} calls</p>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#D4D4D8] group-hover:text-[#A1A1AA] transition-colors">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  </Link>
);

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ totalAgents: 0, totalCalls: 0, avgDuration: "0:00" });
  const [recentAgents, setRecentAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agents = await apiClient.get("/agents");
        setRecentAgents(agents.slice(0, 4));
        setStats({
          totalAgents: agents.length,
          totalCalls: agents.reduce((acc, a) => acc + (a.totalCalls || 0), 0),
          avgDuration: "2:34",
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
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
      <div className="mb-8">
        <h1 className="text-h2 mb-1">
          {greeting()}, {session?.user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-body-sm">
          Here&apos;s what&apos;s happening with your AI agents.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Agents"
          value={stats.totalAgents}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#52525B]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Calls"
          value={stats.totalCalls}
          trend={12}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#52525B]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          }
        />
        <StatCard
          label="Avg. Duration"
          value={stats.avgDuration}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#52525B]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card-flat p-6">
          <h2 className="text-h4 mb-5">Quick Actions</h2>
          <div className="space-y-3">
            <QuickAction
              href="/dashboard/agents/new"
              iconBg="bg-[#18181B]"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              }
              title="Create New Agent"
              description="Set up a new voice AI agent"
            />
            <QuickAction
              href="/dashboard/agents"
              iconBg="bg-[#F4F4F5]"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#52525B]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              }
              title="View All Agents"
              description="Manage your existing agents"
            />
          </div>
        </div>

        {/* Recent Agents */}
        <div className="card-flat p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-h4">Recent Agents</h2>
            {recentAgents.length > 0 && (
              <Link href="/dashboard/agents" className="text-[13px] font-medium text-[#71717A] hover:text-[#18181B] transition-colors">
                View all
              </Link>
            )}
          </div>
          {recentAgents.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-xl bg-[#F4F4F5] flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#A1A1AA]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <p className="text-[14px] text-[#71717A] mb-2">No agents yet</p>
              <Link href="/dashboard/agents/new" className="text-[14px] font-medium text-[#18181B] hover:underline">
                Create your first agent
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentAgents.map((agent) => (
                <RecentAgentRow key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

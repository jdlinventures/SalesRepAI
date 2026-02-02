"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "api-keys", label: "API Keys" },
  { id: "preferences", label: "Preferences" },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");

  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Production Key", key: "sk-****************************abcd", createdAt: "2024-01-15" },
    { id: "2", name: "Development Key", key: "sk-****************************efgh", createdAt: "2024-02-01" },
  ]);

  const [preferences, setPreferences] = useState({
    defaultProvider: "retell",
    emailNotifications: true,
    callAlerts: true,
  });

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    toast.success("Copied to clipboard");
  };

  const handleRevokeKey = (keyId) => {
    setApiKeys(apiKeys.filter((k) => k.id !== keyId));
    toast.success("API key revoked");
  };

  const handleCreateKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: `API Key ${apiKeys.length + 1}`,
      key: "sk-****************************" + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success("API key created");
  };

  return (
    <div className="p-6 lg:p-8 max-w-[800px] mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-h2 mb-1">Settings</h1>
        <p className="text-body-sm">Manage your account settings and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E4E4E7] mb-8">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-[14px] font-medium border-b-2 transition-colors -mb-[1px] ${
                activeTab === tab.id
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent text-[#71717A] hover:text-[#52525B]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="card-flat p-6">
          <h2 className="text-h4 mb-6">Profile Information</h2>

          {/* Avatar */}
          <div className="flex items-center gap-5 mb-8">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "Profile"}
                className="w-16 h-16 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[20px] font-medium text-[#52525B]">
                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-body-sm mb-1">Profile photo from your connected account</p>
              <button className="text-[14px] font-medium text-[#18181B] hover:underline">
                Change photo
              </button>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            <div>
              <label className="text-label block mb-2">Name</label>
              <input
                type="text"
                className="input w-full max-w-[320px]"
                defaultValue={session?.user?.name || ""}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-label block mb-2">Email</label>
              <input
                type="email"
                className="input w-full max-w-[320px] !bg-[#FAFAFA] cursor-not-allowed"
                value={session?.user?.email || ""}
                disabled
              />
              <p className="text-caption mt-1.5">Email cannot be changed</p>
            </div>
          </div>

          <div className="h-[1px] bg-[#E4E4E7] my-6" />

          <button className="btn btn-primary">Save Changes</button>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === "api-keys" && (
        <div className="space-y-6">
          <div className="card-flat p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-h4">API Keys</h2>
                <p className="text-body-sm mt-1">Manage API keys for programmatic access</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleCreateKey}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Key
              </button>
            </div>

            {apiKeys.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-body-sm">No API keys yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-lg border border-[#E4E4E7]"
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-[#18181B]">{apiKey.name}</p>
                      <p className="text-[13px] font-mono text-[#71717A] mt-0.5">{apiKey.key}</p>
                      <p className="text-caption mt-1">Created {apiKey.createdAt}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleCopyKey(apiKey.key)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>
                        Copy
                      </button>
                      <button
                        className="btn btn-ghost btn-sm !text-[#DC2626] hover:!bg-[#FEF2F2]"
                        onClick={() => handleRevokeKey(apiKey.id)}
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-flat p-6">
            <h3 className="text-h4 mb-2">Documentation</h3>
            <p className="text-body-sm">
              Learn how to integrate SalesRepAI into your applications.
            </p>
            <a href="#" className="text-[14px] font-medium text-[#18181B] hover:underline mt-3 inline-block">
              View API Docs →
            </a>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="card-flat p-6">
          <h2 className="text-h4 mb-6">Preferences</h2>

          <div className="space-y-6">
            {/* Default Provider */}
            <div>
              <label className="text-label block mb-2">Default Voice Provider</label>
              <select
                className="select w-full max-w-[240px]"
                value={preferences.defaultProvider}
                onChange={(e) => setPreferences({ ...preferences, defaultProvider: e.target.value })}
              >
                <option value="retell">Retell AI</option>
                <option value="vapi">Vapi</option>
                <option value="elevenlabs">ElevenLabs</option>
              </select>
              <p className="text-caption mt-1.5">Default when creating new agents</p>
            </div>

            <div className="h-[1px] bg-[#E4E4E7]" />

            {/* Notifications */}
            <div>
              <h3 className="text-h4 mb-4">Notifications</h3>

              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-[14px] font-medium text-[#18181B]">Email Notifications</p>
                    <p className="text-caption">Weekly summaries and important updates</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-sm"
                    checked={preferences.emailNotifications}
                    onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-[14px] font-medium text-[#18181B]">Call Alerts</p>
                    <p className="text-caption">Get notified when an agent completes a call</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-sm"
                    checked={preferences.callAlerts}
                    onChange={(e) => setPreferences({ ...preferences, callAlerts: e.target.checked })}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#E4E4E7] my-6" />

          <button className="btn btn-primary" onClick={() => toast.success("Preferences saved")}>
            Save Preferences
          </button>
        </div>
      )}
    </div>
  );
}

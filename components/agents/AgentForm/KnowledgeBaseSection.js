"use client";

import { useState } from "react";

// Knowledge base URL management section
const KnowledgeBaseSection = ({ formData, setFormData }) => {
  const [newUrl, setNewUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddUrl = () => {
    if (!newUrl.trim()) {
      setUrlError("Please enter a URL");
      return;
    }

    if (!isValidUrl(newUrl.trim())) {
      setUrlError("Please enter a valid URL");
      return;
    }

    if (formData.knowledgeBase.includes(newUrl.trim())) {
      setUrlError("This URL has already been added");
      return;
    }

    setFormData({
      ...formData,
      knowledgeBase: [...formData.knowledgeBase, newUrl.trim()],
    });
    setNewUrl("");
    setUrlError("");
  };

  const handleRemoveUrl = (urlToRemove) => {
    setFormData({
      ...formData,
      knowledgeBase: formData.knowledgeBase.filter((url) => url !== urlToRemove),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddUrl();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Knowledge Base</h3>
        <p className="text-sm text-base-content/60 mt-1">
          Add URLs to websites or documentation that the agent should know about.
        </p>
      </div>

      <div className="flex gap-2">
        <div className="form-control flex-1">
          <input
            type="url"
            placeholder="https://example.com/docs"
            className={`input input-bordered w-full ${urlError ? "input-error" : ""}`}
            value={newUrl}
            onChange={(e) => {
              setNewUrl(e.target.value);
              setUrlError("");
            }}
            onKeyDown={handleKeyDown}
          />
          {urlError && (
            <label className="label">
              <span className="label-text-alt text-error">{urlError}</span>
            </label>
          )}
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddUrl}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add
        </button>
      </div>

      {formData.knowledgeBase.length > 0 && (
        <div className="space-y-2">
          {formData.knowledgeBase.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-base-200 rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-base-content/60 shrink-0"
              >
                <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
              </svg>
              <span className="flex-1 truncate text-sm">{url}</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/20"
                onClick={() => handleRemoveUrl(url)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {formData.knowledgeBase.length === 0 && (
        <div className="text-center py-6 text-base-content/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mx-auto mb-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
          <p className="text-sm">No URLs added yet</p>
        </div>
      )}

      <p className="text-xs text-base-content/40">
        File uploads will be available in a future update.
      </p>
    </div>
  );
};

export default KnowledgeBaseSection;

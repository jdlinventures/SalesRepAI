"use client";

import { useState, useRef } from "react";
import apiClient from "@/libs/api";

// Format file size for display
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Knowledge base section with URL and file upload support
const KnowledgeBaseSection = ({ formData, setFormData }) => {
  const [newUrl, setNewUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

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

    // Check for duplicates
    const exists = formData.knowledgeBase.some(
      (item) => item.type === "url" && item.url === newUrl.trim()
    );
    if (exists) {
      setUrlError("This URL has already been added");
      return;
    }

    setFormData({
      ...formData,
      knowledgeBase: [
        ...formData.knowledgeBase,
        { type: "url", url: newUrl.trim(), addedAt: new Date().toISOString() },
      ],
    });
    setNewUrl("");
    setUrlError("");
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError("");

    for (const file of files) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await apiClient.post("/agents/upload", uploadFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Add uploaded file to knowledge base
        setFormData((prev) => ({
          ...prev,
          knowledgeBase: [...prev.knowledgeBase, response],
        }));
      } catch (e) {
        console.error("Upload failed:", e);
        setUploadError(e.message || "Upload failed");
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveItem = async (item, index) => {
    // If it's a file, delete from blob storage
    if (item.type === "file" && item.fileUrl) {
      try {
        await apiClient.delete(`/agents/upload?url=${encodeURIComponent(item.fileUrl)}`);
      } catch (e) {
        console.warn("Failed to delete file:", e);
      }
    }

    setFormData({
      ...formData,
      knowledgeBase: formData.knowledgeBase.filter((_, i) => i !== index),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddUrl();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-h4">Knowledge Base</h3>
        <p className="text-body-sm mt-1">
          Add URLs or upload documents for the agent to reference.
        </p>
      </div>

      {/* URL Input */}
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="url"
            placeholder="https://example.com/docs"
            className={`input w-full ${urlError ? "!border-[#DC2626] focus:!border-[#DC2626]" : ""}`}
            value={newUrl}
            onChange={(e) => {
              setNewUrl(e.target.value);
              setUrlError("");
            }}
            onKeyDown={handleKeyDown}
          />
          {urlError && (
            <p className="text-[13px] text-[#DC2626] mt-1.5">{urlError}</p>
          )}
        </div>
        <button type="button" className="btn btn-primary flex-shrink-0" onClick={handleAddUrl}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add URL
        </button>
      </div>

      {/* File Upload Drop Zone */}
      <div
        className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isUploading
            ? "border-[#18181B] bg-[#FAFAFA]"
            : "border-[#E4E4E7] hover:border-[#D4D4D8] hover:bg-[#FAFAFA]"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt,.md"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="loading-spinner !w-6 !h-6" />
            <p className="text-[14px] text-[#52525B]">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-[#F4F4F5] flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#71717A]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
            </div>
            <p className="mt-3 text-[14px] font-medium text-[#18181B]">Drop files here or click to upload</p>
            <p className="text-[13px] text-[#A1A1AA] mt-1">PDF, DOCX, TXT, MD (max 10MB)</p>
          </>
        )}
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#DC2626]">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span className="text-[13px] text-[#DC2626]">{uploadError}</span>
        </div>
      )}

      {/* Knowledge Base Items List */}
      {formData.knowledgeBase.length > 0 && (
        <div className="space-y-2">
          {formData.knowledgeBase.map((item, index) => (
            <KnowledgeBaseItem
              key={index}
              item={item}
              onRemove={() => handleRemoveItem(item, index)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {formData.knowledgeBase.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-xl bg-[#F4F4F5] flex items-center justify-center mx-auto mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#A1A1AA]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
          </div>
          <p className="text-[14px] text-[#71717A]">No knowledge base items added yet</p>
        </div>
      )}

      <p className="text-caption">
        Maximum 20 items. Uploaded files are processed to extract text for the AI agent.
      </p>
    </div>
  );
};

// Sub-component for rendering individual knowledge base items
const KnowledgeBaseItem = ({ item, onRemove }) => {
  const isUrl = item.type === "url";

  return (
    <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] border border-[#E4E4E7] rounded-lg">
      <div className="w-8 h-8 rounded-lg bg-white border border-[#E4E4E7] flex items-center justify-center flex-shrink-0">
        {isUrl ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-[#71717A]"
          >
            <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
            <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-[#18181B]"
          >
            <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-[#18181B] truncate">
          {isUrl ? item.url : item.fileName}
        </p>
        {!isUrl && item.fileSize && (
          <p className="text-[12px] text-[#A1A1AA]">
            {formatFileSize(item.fileSize)}
          </p>
        )}
      </div>
      <button
        type="button"
        className="p-1.5 rounded-md text-[#71717A] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
        onClick={onRemove}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default KnowledgeBaseSection;

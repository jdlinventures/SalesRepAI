"use client";

// System prompt section with large textarea and character count
const SystemPromptSection = ({ formData, setFormData, errors }) => {
  const maxLength = 10000;
  const charCount = formData.systemPrompt.length;
  const charPercentage = (charCount / maxLength) * 100;

  return (
    <div className="space-y-5">
      <h3 className="text-h4">System Prompt</h3>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-label">Agent Instructions *</label>
          <span
            className={`text-[12px] ${charPercentage > 90 ? "text-[#F59E0B]" : "text-[#A1A1AA]"}`}
          >
            {charCount.toLocaleString()}/{maxLength.toLocaleString()}
          </span>
        </div>
        <textarea
          placeholder="Define how your agent should behave, what information it has access to, and how it should respond to different situations..."
          className={`textarea w-full h-64 font-mono text-[13px] ${errors.systemPrompt ? "!border-[#DC2626] focus:!border-[#DC2626]" : ""}`}
          value={formData.systemPrompt}
          onChange={(e) =>
            setFormData({ ...formData, systemPrompt: e.target.value })
          }
          maxLength={maxLength}
        />
        {errors.systemPrompt && (
          <p className="text-[13px] text-[#DC2626] mt-1.5">{errors.systemPrompt}</p>
        )}
        <p className="text-caption mt-1.5">
          Tip: Be specific about the agent's role, personality, and what information it should or shouldn't share.
        </p>
      </div>
    </div>
  );
};

export default SystemPromptSection;

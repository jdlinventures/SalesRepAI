"use client";

// System prompt section with large textarea and character count
const SystemPromptSection = ({ formData, setFormData, errors }) => {
  const maxLength = 10000;
  const charCount = formData.systemPrompt.length;
  const charPercentage = (charCount / maxLength) * 100;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">System Prompt</h3>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Agent Instructions *</span>
          <span
            className={`label-text-alt ${charPercentage > 90 ? "text-warning" : ""}`}
          >
            {charCount.toLocaleString()}/{maxLength.toLocaleString()}
          </span>
        </label>
        <textarea
          placeholder="Define how your agent should behave, what information it has access to, and how it should respond to different situations..."
          className={`textarea textarea-bordered w-full h-64 font-mono text-sm ${errors.systemPrompt ? "textarea-error" : ""}`}
          value={formData.systemPrompt}
          onChange={(e) =>
            setFormData({ ...formData, systemPrompt: e.target.value })
          }
          maxLength={maxLength}
        />
        {errors.systemPrompt && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.systemPrompt}</span>
          </label>
        )}
        <label className="label">
          <span className="label-text-alt text-base-content/60">
            Tip: Be specific about the agent's role, personality, and what information it should or shouldn't share.
          </span>
        </label>
      </div>
    </div>
  );
};

export default SystemPromptSection;

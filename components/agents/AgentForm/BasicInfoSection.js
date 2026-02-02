"use client";

// Basic info section for agent name and first message
const BasicInfoSection = ({ formData, setFormData, errors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Agent Name *</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Sales Assistant"
          className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          maxLength={100}
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.name}</span>
          </label>
        )}
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">First Message *</span>
          <span className="label-text-alt">{formData.firstMessage.length}/1000</span>
        </label>
        <textarea
          placeholder="The first thing the agent says when a call starts..."
          className={`textarea textarea-bordered w-full h-24 ${errors.firstMessage ? "textarea-error" : ""}`}
          value={formData.firstMessage}
          onChange={(e) =>
            setFormData({ ...formData, firstMessage: e.target.value })
          }
          maxLength={1000}
        />
        {errors.firstMessage && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.firstMessage}</span>
          </label>
        )}
        <label className="label">
          <span className="label-text-alt text-base-content/60">
            Example: "Hi, this is Alex from Acme Corp. How can I help you today?"
          </span>
        </label>
      </div>
    </div>
  );
};

export default BasicInfoSection;

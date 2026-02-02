"use client";

// Basic info section for agent name and first message
const BasicInfoSection = ({ formData, setFormData, errors }) => {
  return (
    <div className="space-y-5">
      <h3 className="text-h4">Basic Information</h3>

      <div>
        <label className="text-label block mb-2">Agent Name *</label>
        <input
          type="text"
          placeholder="e.g., Sales Assistant"
          className={`input w-full ${errors.name ? "!border-[#DC2626] focus:!border-[#DC2626]" : ""}`}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          maxLength={100}
        />
        {errors.name && (
          <p className="text-[13px] text-[#DC2626] mt-1.5">{errors.name}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-label">First Message *</label>
          <span className="text-[12px] text-[#A1A1AA]">{formData.firstMessage.length}/1000</span>
        </div>
        <textarea
          placeholder="The first thing the agent says when a call starts..."
          className={`textarea w-full h-24 ${errors.firstMessage ? "!border-[#DC2626] focus:!border-[#DC2626]" : ""}`}
          value={formData.firstMessage}
          onChange={(e) =>
            setFormData({ ...formData, firstMessage: e.target.value })
          }
          maxLength={1000}
        />
        {errors.firstMessage && (
          <p className="text-[13px] text-[#DC2626] mt-1.5">{errors.firstMessage}</p>
        )}
        <p className="text-caption mt-1.5">
          Example: "Hi, this is Alex from Acme Corp. How can I help you today?"
        </p>
      </div>
    </div>
  );
};

export default BasicInfoSection;

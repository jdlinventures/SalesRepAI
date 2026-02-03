"use client";

import { getProviderVoices, getProviderModels, getLanguages } from "@/libs/providers";
import { getCostPerMinute, formatCost, getCostExamples } from "@/libs/pricing";

// Voice, LLM model, and language selection
const VoiceSection = ({ formData, setFormData, errors }) => {
  const voices = getProviderVoices(formData.provider);
  const models = getProviderModels(formData.provider);
  const languages = getLanguages();

  const handleVoiceChange = (e) => {
    const selectedVoice = voices.find((v) => v.id === e.target.value);
    setFormData({
      ...formData,
      voiceId: selectedVoice?.id || "",
      voiceName: selectedVoice?.name || "",
    });
  };

  // Get cost estimates
  const costs = getCostPerMinute(formData.provider, formData.llmModel);
  const examples = getCostExamples(formData.provider, formData.llmModel);

  return (
    <div className="space-y-5">
      <h3 className="text-h4">Voice & Model Settings</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-label block mb-2">Voice *</label>
          <select
            className={`select w-full ${errors.voiceId ? "!border-[#DC2626] focus:!border-[#DC2626]" : ""}`}
            value={formData.voiceId}
            onChange={handleVoiceChange}
          >
            <option value="">Select a voice</option>
            {voices.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} {voice.gender ? `(${voice.gender})` : ""}
              </option>
            ))}
          </select>
          {errors.voiceId && (
            <p className="text-[13px] text-[#DC2626] mt-1.5">{errors.voiceId}</p>
          )}
        </div>

        <div>
          <label className="text-label block mb-2">LLM Model</label>
          <select
            className="select w-full"
            value={formData.llmModel}
            onChange={(e) =>
              setFormData({ ...formData, llmModel: e.target.value })
            }
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-label block mb-2">Language</label>
          <select
            className="select w-full"
            value={formData.language}
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cost Estimate Card */}
      <div className="p-4 rounded-xl bg-[#F4F4F5] border border-[#E4E4E7]">
        <div className="flex items-center gap-2 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-[#52525B]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-[13px] font-semibold text-[#18181B]">Estimated API Cost</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-[12px] text-[#71717A] mb-1">Voice</p>
            <p className="text-[14px] font-medium text-[#18181B]">{formatCost(costs.voice)}/min</p>
          </div>
          <div>
            <p className="text-[12px] text-[#71717A] mb-1">LLM</p>
            <p className="text-[14px] font-medium text-[#18181B]">{formatCost(costs.llm)}/min</p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E4E4E7]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-semibold text-[#18181B]">Total</p>
            <p className="text-[15px] font-bold text-[#18181B]">{formatCost(costs.total)}/min</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <span
                key={ex.duration}
                className="text-[11px] px-2 py-1 rounded-md bg-white border border-[#E4E4E7] text-[#52525B]"
              >
                {ex.duration} ≈ {ex.cost}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSection;

"use client";

import { getProviderVoices, getProviderModels, getLanguages } from "@/libs/providers";

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
    </div>
  );
};

export default VoiceSection;

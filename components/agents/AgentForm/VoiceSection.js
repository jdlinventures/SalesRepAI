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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Voice & Model Settings</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Voice *</span>
          </label>
          <select
            className={`select select-bordered w-full ${errors.voiceId ? "select-error" : ""}`}
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
            <label className="label">
              <span className="label-text-alt text-error">{errors.voiceId}</span>
            </label>
          )}
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">LLM Model</span>
          </label>
          <select
            className="select select-bordered w-full"
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

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Language</span>
          </label>
          <select
            className="select select-bordered w-full"
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

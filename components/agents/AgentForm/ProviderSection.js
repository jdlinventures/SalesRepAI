"use client";

const providers = [
  {
    id: "retell",
    name: "Retell AI",
    description: "High-quality voice AI with low latency",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
        <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
      </svg>
    ),
  },
  {
    id: "vapi",
    name: "Vapi",
    description: "Voice AI platform for developers",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description: "Ultra-realistic voice synthesis",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
      </svg>
    ),
  },
];

// Provider selection with radio cards
const ProviderSection = ({ formData, setFormData, errors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-h4">Voice Provider</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {providers.map((provider) => (
          <label
            key={provider.id}
            className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              formData.provider === provider.id
                ? "border-[#18181B] bg-[#FAFAFA]"
                : "border-[#E4E4E7] hover:border-[#D4D4D8] hover:bg-[#FAFAFA]"
            }`}
          >
            <input
              type="radio"
              name="provider"
              value={provider.id}
              checked={formData.provider === provider.id}
              onChange={(e) =>
                setFormData({ ...formData, provider: e.target.value })
              }
              className="hidden"
            />
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                formData.provider === provider.id
                  ? "bg-[#18181B] text-white"
                  : "bg-[#F4F4F5] text-[#52525B]"
              }`}
            >
              {provider.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#18181B]">{provider.name}</p>
              <p className="text-[13px] text-[#71717A] leading-[1.4]">
                {provider.description}
              </p>
            </div>
            {formData.provider === provider.id && (
              <div className="absolute top-3 right-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#18181B]">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>

      {errors.provider && (
        <p className="text-[13px] text-[#DC2626]">{errors.provider}</p>
      )}
    </div>
  );
};

export default ProviderSection;

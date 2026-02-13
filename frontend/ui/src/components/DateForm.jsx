import React from 'react';

const DATE_TYPES = ['Cozy', 'Luxury', 'Nature', 'Fun', 'Movie Night'];
const SURPRISE_LEVELS = ['Low', 'Medium', 'High'];

export default function DateForm({ formData, setFormData, onSubmit, loading = false }) {
  const update = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updatePersonality = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      personality: { ...(prev.personality || {}), [key]: value },
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="space-y-6 w-full max-w-2xl mx-auto"
    >
      {/* Planner's Name */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-rose-900">Your Name</label>
        <input
          type="text"
          value={formData.plannerName || ''}
          onChange={(e) => update('plannerName', e.target.value)}
          placeholder="The one planning love..."
          className="w-full px-4 py-3 rounded-2xl border-2 border-rose-200 bg-rose-50/50 text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
        />
      </div>

      {/* Partner's Name */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-rose-900">Their Name</label>
        <input
          type="text"
          value={formData.partnerName || ''}
          onChange={(e) => update('partnerName', e.target.value)}
          placeholder="The lucky one..."
          className="w-full px-4 py-3 rounded-2xl border-2 border-rose-200 bg-rose-50/50 text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
        />
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-rose-900">Where the Magic Happens</label>
        <input
          type="text"
          value={formData.city || ''}
          onChange={(e) => update('city', e.target.value)}
          placeholder="Your city of love"
          className="w-full px-4 py-3 rounded-2xl border-2 border-rose-200 bg-rose-50/50 text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
        />
      </div>

      {/* Budget slider */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-rose-900">
          Budget: <span className="text-rose-600 font-bold">₹{formData.budget ?? 3000}</span>
        </label>
        <input
          type="range"
          min={500}
          max={10000}
          step={500}
          value={formData.budget ?? 3000}
          onChange={(e) => update('budget', Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none bg-gradient-to-r from-rose-200 to-rose-400 accent-rose-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs mt-2 text-rose-600 font-medium">
          <span>₹500</span>
          <span>₹10,000</span>
        </div>
      </div>

      {/* Date Type */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-rose-900">Date Vibe</label>
        <select
          value={formData.dateType || 'Cozy'}
          onChange={(e) => update('dateType', e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border-2 border-rose-200 bg-rose-50/50 text-rose-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
        >
          {DATE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Indoor / Outdoor */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-rose-900">Indoor or Outdoor?</label>
        <div className="flex gap-6">
          {['indoor', 'outdoor'].map((opt) => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="indoorOutdoor"
                checked={(formData.indoorOutdoor || 'indoor') === opt}
                onChange={() => update('indoorOutdoor', opt)}
                className="w-5 h-5 accent-rose-500 cursor-pointer"
              />
              <span className="capitalize font-medium text-rose-900 group-hover:text-rose-600 transition">
                {opt === 'indoor' ? 'Indoors' : 'Outdoors'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Surprise Level */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-rose-900">How Surprising?</label>
        <div className="flex flex-wrap gap-3">
          {SURPRISE_LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="surpriseLevel"
                value={level.toLowerCase()}
                checked={(formData.surpriseLevel || 'medium') === level.toLowerCase()}
                onChange={(e) => update('surpriseLevel', e.target.value)}
                className="w-5 h-5 accent-rose-500 cursor-pointer"
              />
              <span className="font-medium text-rose-900 group-hover:text-rose-600 transition">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Partner's Personality */}
      <div className="space-y-4 p-6 rounded-3xl bg-gradient-to-br from-rose-100/30 to-pink-100/30 border-2 border-rose-200">
        <span className="block text-sm font-bold uppercase tracking-wide text-rose-900">Their Personality</span>

        {/* Introvert/Extrovert */}
        <div>
          <span className="text-xs block mb-2 font-semibold text-rose-800">Introvert or Extrovert?</span>
          <div className="flex gap-6">
            {['introvert', 'extrovert'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="introvertExtrovert"
                  checked={(formData.personality?.introvertExtrovert || 'introvert') === opt}
                  onChange={() => updatePersonality('introvertExtrovert', opt)}
                  className="w-4 h-4 accent-rose-500"
                />
                <span className="capitalize text-rose-900 font-medium">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Calm/Adventurous */}
        <div>
          <span className="text-xs block mb-2 font-semibold text-rose-800">Calm or Adventurous?</span>
          <div className="flex gap-6">
            {['calm', 'adventurous'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="calmAdventurous"
                  checked={(formData.personality?.calmAdventurous || 'calm') === opt}
                  onChange={() => updatePersonality('calmAdventurous', opt)}
                  className="w-4 h-4 accent-rose-500"
                />
                <span className="capitalize text-rose-900 font-medium">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Private/Social */}
        <div>
          <span className="text-xs block mb-2 font-semibold text-rose-800">Private or Social?</span>
          <div className="flex gap-6">
            {['private', 'social'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="privateSocial"
                  checked={(formData.personality?.privateSocial || 'private') === opt}
                  onChange={() => updatePersonality('privateSocial', opt)}
                  className="w-4 h-4 accent-rose-500"
                />
                <span className="capitalize text-rose-900 font-medium">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-2xl font-bold text-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-300/50 hover:shadow-xl hover:shadow-rose-400/60 hover:scale-105 active:scale-95 transition duration-200 disabled:opacity-70 disabled:pointer-events-none"
      >
        {loading ? 'Creating your plan…' : 'Create My Perfect Date'}
      </button>
    </form>
  );
}

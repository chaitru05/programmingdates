import React from 'react';

const DATE_TYPES = ['Cozy', 'Luxury', 'Nature', 'Fun', 'Movie Night'];
const SURPRISE_LEVELS = ['Low', 'Medium', 'High'];

export default function PersonCard({ title, person, setPerson }) {
  const update = (key, value) => {
    setPerson((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-3xl p-6 bg-white/40 backdrop-blur-md border-2 border-rose-200 shadow-xl space-y-6">
      <h3 className="text-xl font-bold text-rose-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h3>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-rose-900">Name</label>
        <input
          type="text"
          value={person.name || ''}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Name"
          className="w-full px-4 py-3 rounded-2xl border-2 border-rose-200 bg-rose-50/50 text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
        />
      </div>

      {/* Personality */}
      <div>
        <span className="text-xs block mb-2 font-semibold text-rose-800">Personality</span>
        <div className="flex gap-4">
          {['introvert', 'extrovert'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name={`${title}-personality`}
                checked={(person.personality || 'introvert') === opt}
                onChange={() => update('personality', opt)}
                className="w-4 h-4 accent-rose-500"
              />
              <span className="capitalize text-sm font-medium text-rose-900 group-hover:text-rose-600 transition">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Energy */}
      <div>
        <span className="text-xs block mb-2 font-semibold text-rose-800">Energy</span>
        <div className="flex gap-4">
          {['calm', 'adventurous'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name={`${title}-energy`}
                checked={(person.energy || 'calm') === opt}
                onChange={() => update('energy', opt)}
                className="w-4 h-4 accent-rose-500"
              />
              <span className="capitalize text-sm font-medium text-rose-900 group-hover:text-rose-600 transition">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Vibe */}
      <div>
        <span className="text-xs block mb-2 font-semibold text-rose-800">Vibe</span>
        <div className="flex gap-4">
          {['private', 'social'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name={`${title}-vibe`}
                checked={(person.vibe || 'private') === opt}
                onChange={() => update('vibe', opt)}
                className="w-4 h-4 accent-rose-500"
              />
              <span className="capitalize text-sm font-medium text-rose-900 group-hover:text-rose-600 transition">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-rose-900">
          Budget comfort: <span className="text-rose-600 font-bold">₹{person.budgetComfort ?? 3000}</span>
        </label>
        <input
          type="range"
          min={500}
          max={10000}
          step={500}
          value={person.budgetComfort ?? 3000}
          onChange={(e) => update('budgetComfort', Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none bg-gradient-to-r from-rose-200 to-rose-400 accent-rose-600 cursor-pointer"
        />
      </div>

      {/* Preferred Date Type */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-rose-900">Preferred date type</label>
        <select
          value={person.preferredDateType || 'Cozy'}
          onChange={(e) => update('preferredDateType', e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border-2 border-rose-200 bg-rose-50/50 text-rose-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
        >
          {DATE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Indoor / Outdoor */}
      <div>
        <span className="text-xs block mb-2 font-semibold text-rose-800">Indoor / Outdoor</span>
        <div className="flex gap-4">
          {['indoor', 'outdoor'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name={`${title}-io`}
                checked={(person.indoorOutdoor || 'indoor') === opt}
                onChange={() => update('indoorOutdoor', opt)}
                className="w-4 h-4 accent-rose-500"
              />
              <span className="capitalize text-sm font-medium text-rose-900 group-hover:text-rose-600 transition">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Surprise Level */}
      <div>
        <span className="text-xs block mb-2 font-semibold text-rose-800">Surprise level</span>
        <div className="flex gap-4 flex-wrap">
          {SURPRISE_LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name={`${title}-surprise`}
                value={level.toLowerCase()}
                checked={(person.surpriseLevel || 'medium') === level.toLowerCase()}
                onChange={(e) => update('surpriseLevel', e.target.value)}
                className="w-4 h-4 accent-rose-500"
              />
              <span className="text-sm font-medium text-rose-900 group-hover:text-rose-600 transition">{level}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

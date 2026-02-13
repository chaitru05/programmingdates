import React from 'react';
import PersonCard from './PersonCard.jsx';

const defaultPerson = {
  name: '',
  personality: 'introvert',
  energy: 'calm',
  vibe: 'private',
  budgetComfort: 3000,
  preferredDateType: 'Cozy',
  indoorOutdoor: 'indoor',
  surpriseLevel: 'medium',
};

export default function DualDateForm({ person1, person2, setPerson1, setPerson2, city, setCity, onSubmit, loading }) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}
      className="space-y-8 w-full max-w-5xl mx-auto"
    >
      <div className="rounded-3xl p-6 bg-white/40 backdrop-blur-md border-2 border-rose-200">
        <label className="block text-sm font-semibold mb-2 text-rose-900">City for your date</label>
        <input
          type="text"
          value={city || ''}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Mumbai, Delhi"
          className="w-full px-4 py-3 rounded-2xl border-2 border-rose-200 bg-rose-50/50 text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PersonCard title="❤️ Person 1" person={person1} setPerson={setPerson1} />
        <PersonCard title="💕 Person 2" person={person2} setPerson={setPerson2} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-2xl font-bold text-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-300/50 hover:shadow-xl hover:shadow-rose-400/60 hover:scale-[1.01] active:scale-[0.99] transition duration-200 disabled:opacity-70 disabled:pointer-events-none"
      >
        {loading ? 'Creating your plan…' : '❤️ See compatibility & create plan'}
      </button>
    </form>
  );
}


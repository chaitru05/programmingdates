import React, { useState } from 'react';

const DATE_TYPES = ['Cozy', 'Luxury', 'Nature', 'Fun', 'Movie Night'];
const SURPRISE_LEVELS = ['Low', 'Medium', 'High'];

const STEPS = [
  { id: 'city', title: 'Start with a location', icon: '📍' },
  { id: 'p1_intro', title: 'Partner 1', icon: '👤' },
  { id: 'p1_personality', title: 'Partner 1: Personality', icon: '🧠' },
  { id: 'p1_prefs', title: 'Partner 1: Preferences', icon: '❤️' },
  { id: 'p2_intro', title: 'Partner 2', icon: '👤' },
  { id: 'p2_personality', title: 'Partner 2: Personality', icon: '🧠' },
  { id: 'p2_prefs', title: 'Partner 2: Preferences', icon: '❤️' },
];

export default function DualDateForm({ person1, person2, setPerson1, setPerson2, city, setCity, onSubmit, loading }) {
  const [currentStep, setCurrentStep] = useState(0);

  const updatePerson = (person, setPerson, key, value) => {
    setPerson((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onSubmit?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // City
        return city?.trim().length > 0;
      case 1: // P1 Name
        return person1.name?.trim().length > 0;
      case 4: // P2 Name
        return person2.name?.trim().length > 0;
      default:
        return true;
    }
  };

  const renderPersonalityStep = (person, setPerson) => (
    <div className="space-y-8 animate-fade-in-up">
      <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 space-y-6">
        {/* Introvert/Extrovert */}
        <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-rose-100">
          <button
            type="button"
            onClick={() => updatePerson(person, setPerson, 'personality', 'introvert')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all ${person.personality === 'introvert'
              ? 'bg-rose-100 text-rose-700 font-bold shadow-sm'
              : 'text-rose-400 hover:text-rose-600'
              }`}
          >
            🐢 Introvert
          </button>
          <button
            type="button"
            onClick={() => updatePerson(person, setPerson, 'personality', 'extrovert')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all ${person.personality === 'extrovert'
              ? 'bg-rose-100 text-rose-700 font-bold shadow-sm'
              : 'text-rose-400 hover:text-rose-600'
              }`}
          >
            � Extrovert
          </button>
        </div>

        {/* Calm/Adventurous (Energy) */}
        <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-rose-100">
          <button
            type="button"
            onClick={() => updatePerson(person, setPerson, 'energy', 'calm')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all ${person.energy === 'calm'
              ? 'bg-rose-100 text-rose-700 font-bold shadow-sm'
              : 'text-rose-400 hover:text-rose-600'
              }`}
          >
            🧘 Calm
          </button>
          <button
            type="button"
            onClick={() => updatePerson(person, setPerson, 'energy', 'adventurous')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all ${person.energy === 'adventurous'
              ? 'bg-rose-100 text-rose-700 font-bold shadow-sm'
              : 'text-rose-400 hover:text-rose-600'
              }`}
          >
            🧗 Adventurous
          </button>
        </div>

        {/* Private/Social (Vibe) */}
        <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-rose-100">
          <button
            type="button"
            onClick={() => updatePerson(person, setPerson, 'vibe', 'private')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all ${person.vibe === 'private'
              ? 'bg-rose-100 text-rose-700 font-bold shadow-sm'
              : 'text-rose-400 hover:text-rose-600'
              }`}
          >
            🔒 Private
          </button>
          <button
            type="button"
            onClick={() => updatePerson(person, setPerson, 'vibe', 'social')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all ${person.vibe === 'social'
              ? 'bg-rose-100 text-rose-700 font-bold shadow-sm'
              : 'text-rose-400 hover:text-rose-600'
              }`}
          >
            🎉 Social
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrefsStep = (person, setPerson) => (
    <div className="space-y-6 animate-fade-in-up">
      {/* Date Type */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-rose-800">Preferred Vibe</label>
        <div className="grid grid-cols-2 gap-2">
          {DATE_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => updatePerson(person, setPerson, 'preferredDateType', t)}
              className={`p-3 rounded-xl border text-sm transition-all ${person.preferredDateType === t
                ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm'
                : 'border-rose-100 bg-white text-rose-900 hover:border-rose-300'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Comfort */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-rose-800">
          Budget Comfort: <span className="text-rose-600 font-bold">₹{person.budgetComfort ?? 3000}</span>
        </label>
        <input
          type="range"
          min={500}
          max={10000}
          step={500}
          value={person.budgetComfort ?? 3000}
          onChange={(e) => updatePerson(person, setPerson, 'budgetComfort', Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none bg-rose-200 accent-rose-500 cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Indoor/Outdoor */}
        <div>
          <label className="block text-xs font-semibold mb-2 text-rose-800">Setting</label>
          <div className="flex gap-2">
            {['indoor', 'outdoor'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => updatePerson(person, setPerson, 'indoorOutdoor', opt)}
                className={`flex-1 p-2 rounded-lg border text-xs capitalize ${person.indoorOutdoor === opt
                  ? 'bg-rose-100 border-rose-300 text-rose-800 font-bold'
                  : 'bg-white border-rose-100 text-rose-600'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        {/* Surprise */}
        <div>
          <label className="block text-xs font-semibold mb-2 text-rose-800">Surprise</label>
          <div className="flex gap-1">
            {SURPRISE_LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => updatePerson(person, setPerson, 'surpriseLevel', lvl.toLowerCase())}
                className={`flex-1 p-2 rounded-lg border text-xs ${person.surpriseLevel === lvl.toLowerCase()
                  ? 'bg-rose-100 border-rose-300 text-rose-800 font-bold'
                  : 'bg-white border-rose-100 text-rose-600'
                  }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // City
        return (
          <div className="space-y-6 animate-fade-in-up">
            <label className="block text-xl font-semibold mb-2 text-rose-800">City for your date</label>
            <input
              type="text"
              value={city || ''}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai, Paris"
              className="w-full px-6 py-4 rounded-2xl border-2 border-rose-200 bg-white text-lg focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
              autoFocus
            />
          </div>
        );
      case 1: // P1 Intro
        return (
          <div className="space-y-6 animate-fade-in-up">
            <label className="block text-xl font-semibold mb-2 text-rose-800">Partner 1 Name</label>
            <input
              type="text"
              value={person1.name || ''}
              onChange={(e) => updatePerson(person1, setPerson1, 'name', e.target.value)}
              placeholder="Enter name"
              className="w-full px-6 py-4 rounded-2xl border-2 border-rose-200 bg-white text-lg focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
              autoFocus
            />
          </div>
        );
      case 2: // P1 Personality
        return renderPersonalityStep(person1, setPerson1);
      case 3: // P1 Prefs
        return renderPrefsStep(person1, setPerson1);
      case 4: // P2 Intro
        return (
          <div className="space-y-6 animate-fade-in-up">
            <label className="block text-xl font-semibold mb-2 text-rose-800">Partner 2 Name</label>
            <input
              type="text"
              value={person2.name || ''}
              onChange={(e) => updatePerson(person2, setPerson2, 'name', e.target.value)}
              placeholder="Enter name"
              className="w-full px-6 py-4 rounded-2xl border-2 border-rose-200 bg-white text-lg focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
              autoFocus
            />
          </div>
        );
      case 5: // P2 Personality
        return renderPersonalityStep(person2, setPerson2);
      case 6: // P2 Prefs
        return renderPrefsStep(person2, setPerson2);
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[600px] w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-rose-200 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden">

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-rose-50">
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step Header */}
        <div className="text-center mb-8 mt-4">
          <span className="text-6xl mb-4 block animate-bounce-slow">{STEPS[currentStep].icon}</span>
          <h2 className="text-3xl font-bold text-rose-800 mb-2">{STEPS[currentStep].title}</h2>
          <p className="text-rose-400 text-sm font-medium uppercase tracking-widest">
            Step {currentStep + 1} of {STEPS.length}
          </p>
        </div>

        {/* Dynamic Content */}
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          <div className="min-h-[300px] flex flex-col justify-center">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-rose-100">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-4 rounded-xl font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
              >
                ← Back
              </button>
            )}
            <button
              type="submit"
              disabled={!isStepValid() || loading}
              className="flex-[2] py-4 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Creating Plan...' : currentStep === STEPS.length - 1 ? '✨ Measure Compatibility' : 'Next →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


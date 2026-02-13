import React, { useState } from 'react';

const STEPS = [
  { id: 'intro', title: 'Who is this for?', icon: '❤️' },
  { id: 'location', title: 'Where are we going?', icon: '📍' },
  { id: 'vibe', title: 'What’s the vibe?', icon: '✨' },
  { id: 'budget', title: 'What’s the budget?', icon: '💰' },
  { id: 'surprise', title: 'Surprise Level', icon: '🎁' },
  { id: 'personality', title: 'Their Personality', icon: '🧠' },
];

const DATE_TYPES = ['Cozy', 'Luxury', 'Nature', 'Fun', 'Movie Night'];
const SURPRISE_LEVELS = ['Low', 'Medium', 'High'];

export default function DateForm({ formData, setFormData, onSubmit, loading = false }) {
  const [currentStep, setCurrentStep] = useState(0);

  const update = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updatePersonality = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      personality: { ...(prev.personality || {}), [key]: value },
    }));
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
      case 0: // Intro
        return formData.plannerName?.trim() && formData.partnerName?.trim();
      case 1: // Location
        return formData.city?.trim();
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-lg font-semibold mb-2 text-rose-800">Your Name</label>
              <input
                type="text"
                value={formData.plannerName || ''}
                onChange={(e) => update('plannerName', e.target.value)}
                placeholder="The one planning love..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-rose-200 bg-white text-lg focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2 text-rose-800">Their Name</label>
              <input
                type="text"
                value={formData.partnerName || ''}
                onChange={(e) => update('partnerName', e.target.value)}
                placeholder="The lucky one..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-rose-200 bg-white text-lg focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-lg font-semibold mb-2 text-rose-800">City</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => update('city', e.target.value)}
                placeholder="Where will love happen?"
                className="w-full px-6 py-4 rounded-2xl border-2 border-rose-200 bg-white text-lg focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
                autoFocus
              />
              <p className="text-rose-400 text-sm mt-2 ml-1">e.g. Paris, New York, Mumbai</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <label className="block text-lg font-semibold mb-4 text-rose-800">Date Vibe</label>
              <div className="grid grid-cols-2 gap-3">
                {DATE_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update('dateType', t)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${formData.dateType === t
                      ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-md'
                      : 'border-rose-100 bg-white text-rose-900 hover:border-rose-300'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-semibold mb-4 text-rose-800">Setting</label>
              <div className="flex gap-4">
                {['indoor', 'outdoor'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update('indoorOutdoor', opt)}
                    className={`flex-1 p-4 rounded-xl border-2 capitalize transition-all ${formData.indoorOutdoor === opt
                      ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-md'
                      : 'border-rose-100 bg-white text-rose-900 hover:border-rose-300'
                      }`}
                  >
                    {opt === 'indoor' ? '🏠 Indoors' : '🌳 Outdoors'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="text-center">
              <span className="text-6xl font-bold text-rose-500 block mb-2">₹{formData.budget ?? 3000}</span>
              <p className="text-rose-400">Total Budget</p>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={500}
              value={formData.budget ?? 3000}
              onChange={(e) => update('budget', Number(e.target.value))}
              className="w-full h-4 rounded-full appearance-none bg-rose-200 accent-rose-500 cursor-pointer hover:accent-rose-600 transition-all"
            />
            <div className="flex justify-between text-rose-400 font-medium px-1">
              <span>₹500</span>
              <span>₹10,000+</span>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col gap-4">
              {SURPRISE_LEVELS.map((level) => {
                const val = level.toLowerCase();
                const Icon = val === 'low' ? '😌' : val === 'medium' ? '🤔' : '😲';
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => update('surpriseLevel', val)}
                    className={`p-6 rounded-2xl border-2 flex items-center gap-4 transition-all ${formData.surpriseLevel === val
                      ? 'border-rose-500 bg-rose-50 shadow-md transform scale-[1.02]'
                      : 'border-rose-100 bg-white hover:border-rose-300 hover:bg-rose-50/50'
                      }`}
                  >
                    <span className="text-4xl">{Icon}</span>
                    <div className="text-left">
                      <span className={`block text-xl font-bold ${formData.surpriseLevel === val ? 'text-rose-700' : 'text-rose-900'}`}>
                        {level} Surprise
                      </span>
                      <span className="text-sm text-rose-400">
                        {val === 'low' ? 'Keep it simple & predictable' : val === 'medium' ? 'A nice twist to the evening' : 'Something totally unexpected!'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
              <p className="text-rose-800 font-medium text-center mb-6">How would you describe them?</p>

              <div className="space-y-6">
                {/* Introvert/Extrovert */}
                <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-rose-100">
                  <button
                    type="button"
                    onClick={() => updatePersonality('introvertExtrovert', 'introvert')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-all ${formData.personality?.introvertExtrovert === 'introvert'
                      ? 'bg-rose-100 text-rose-700 font-bold shadow-sm'
                      : 'text-rose-400 hover:text-rose-600'
                      }`}
                  >
                    Introvert 🐢
                  </button>
                  <button
                    type="button"
                    onClick={() => updatePersonality('introvertExtrovert', 'extrovert')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-all ${formData.personality?.introvertExtrovert === 'extrovert'
                      ? 'bg-rose-100 text-rose-700 font-bold shadow-sm'
                      : 'text-rose-400 hover:text-rose-600'
                      }`}
                  >
                    🦁 Extrovert
                  </button>
                </div>

                {/* Calm/Adventurous */}
                <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-rose-100">
                  <button
                    type="button"
                    onClick={() => updatePersonality('calmAdventurous', 'calm')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-all ${formData.personality?.calmAdventurous === 'calm'
                      ? 'bg-rose-100 text-rose-700 font-bold shadow-sm'
                      : 'text-rose-400 hover:text-rose-600'
                      }`}
                  >
                    Calm 🧘
                  </button>
                  <button
                    type="button"
                    onClick={() => updatePersonality('calmAdventurous', 'adventurous')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-all ${formData.personality?.calmAdventurous === 'adventurous'
                      ? 'bg-rose-100 text-rose-700 font-bold shadow-sm'
                      : 'text-rose-400 hover:text-rose-600'
                      }`}
                  >
                    🧗 Adventurous
                  </button>
                </div>

                {/* Private/Social */}
                <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-rose-100">
                  <button
                    type="button"
                    onClick={() => updatePersonality('privateSocial', 'private')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-all ${formData.personality?.privateSocial === 'private'
                      ? 'bg-rose-100 text-rose-700 font-bold shadow-sm'
                      : 'text-rose-400 hover:text-rose-600'
                      }`}
                  >
                    Private 🔒
                  </button>
                  <button
                    type="button"
                    onClick={() => updatePersonality('privateSocial', 'social')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-all ${formData.personality?.privateSocial === 'social'
                      ? 'bg-rose-100 text-rose-700 font-bold shadow-sm'
                      : 'text-rose-400 hover:text-rose-600'
                      }`}
                  >
                    🎉 Social
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
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
        <div className="text-center mb-10 mt-4">
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
              {loading ? 'Creating Plan...' : currentStep === STEPS.length - 1 ? '✨ Create My Date' : 'Next →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useCallback } from 'react';
import DateForm from './components/DateForm.jsx';
import ResultCard from './components/ResultCard.jsx';
import ResultCardDual from './components/ResultCardDual.jsx';
import MapSection from './components/MapSection.jsx';
import StartScreen from './components/StartScreen.jsx';
import DualDateForm from './components/DualDateForm.jsx';
import { generateDatePlanAsync } from './utils/generator.js';
import { calculateCompatibility, mergePreferences } from './utils/compatibilityDual.js';
import { generateAIPlan } from './utils/openaiPlan.js';

const defaultForm = {
  plannerName: '',
  partnerName: '',
  city: '',
  budget: 3000,
  dateType: 'Cozy',
  indoorOutdoor: 'indoor',
  surpriseLevel: 'medium',
  personality: {
    introvertExtrovert: 'introvert',
    calmAdventurous: 'calm',
    privateSocial: 'private',
  },
};

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

export default function App() {
  const [mode, setMode] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dual flow state
  const [person1, setPerson1] = useState(defaultPerson);
  const [person2, setPerson2] = useState(defaultPerson);
  const [dualCity, setDualCity] = useState('');
  const [dualPlan, setDualPlan] = useState(null);
  const [compatibility, setCompatibility] = useState(null);
  const [mergedPrefs, setMergedPrefs] = useState(null);
  const [dualLoading, setDualLoading] = useState(false);
  const [dualError, setDualError] = useState(null);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const newPlan = await generateDatePlanAsync(formData);
      setPlan({ ...newPlan, surpriseIdea: null });
    } catch (err) {
      setError(err?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const handleSurprise = useCallback((idea) => {
    setPlan((prev) => (prev ? { ...prev, surpriseIdea: idea } : null));
  }, []);

  const handleDualSubmit = useCallback(async () => {
    setDualError(null);
    setDualLoading(true);
    try {
      const compat = calculateCompatibility(person1, person2);
      setCompatibility(compat);
      const merged = mergePreferences(person1, person2, compat.percentage);
      setMergedPrefs(merged);
      const result = await generateAIPlan(merged, compat);
      if (result.plan) {
        setDualPlan(result.plan);
      } else if (result.error === 'MISSING_KEY') {
        setDualError(
          'Gemini API key not set. Create a .env file in the frontend/ui folder (same folder as package.json) with: VITE_GEMINI_API_KEY=your_key_here — then restart the dev server (npm run dev). Get a key at https://aistudio.google.com/apikey'
        );
      } else {
        setDualError(result.message || 'Could not generate plan. Check your VITE_GEMINI_API_KEY and try again.');
      }
    } catch (err) {
      setDualError(err?.message || 'Something went wrong. Try again.');
    } finally {
      setDualLoading(false);
    }
  }, [person1, person2]);

  const backToStart = useCallback(() => {
    setMode(null);
    setPlan(null);
    setDualPlan(null);
    setCompatibility(null);
    setMergedPrefs(null);
    setError(null);
    setDualError(null);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        {mode !== null && (
          <header className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--dark-accent)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              LoveCraft AI
            </h1>
            <p className="text-[var(--dark-accent)]/80 text-lg">Smart Date Planner</p>
            <button
              type="button"
              onClick={backToStart}
              className="mt-4 text-sm text-[var(--primary-accent)] hover:underline"
            >
              ← Back to start
            </button>
          </header>
        )}

        {mode === null && (
          <StartScreen
            onSelectSingle={() => setMode('single')}
            onSelectDual={() => setMode('dual')}
          />
        )}

        {mode === 'single' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="rounded-2xl p-6 md:p-8 bg-white/25 backdrop-blur-md border border-white/40 shadow-xl hover:shadow-2xl transition duration-300">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[var(--dark-accent)]" style={{ fontFamily: 'var(--font-heading)' }}>
                ❤️ Plan your date
              </h2>
              <DateForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} loading={loading} />
              {error && <p className="mt-3 text-sm text-red-600 bg-red-50/80 rounded-lg p-2">{error}</p>}
            </section>
            <section className="space-y-6">
              {loading && (
                <div className="rounded-2xl p-8 bg-white/25 backdrop-blur-md border border-white/40 shadow-xl text-center text-[var(--dark-accent)]">
                  <p className="font-medium">Creating your date plan…</p>
                  <p className="text-sm mt-1 opacity-80">Using AI to personalize every detail</p>
                </div>
              )}
              {plan && !loading && <ResultCard plan={plan} formData={formData} onSurprise={handleSurprise} />}
              <div className="rounded-2xl p-6 bg-white/25 backdrop-blur-md border border-white/40 shadow-xl">
                <MapSection city={formData.city} dateType={formData.dateType} />
              </div>
            </section>
          </div>
        )}

        {mode === 'dual' && (
          <div className="space-y-8">
            {!dualPlan ? (
              <>
                <section className="rounded-2xl p-6 md:p-8 bg-white/25 backdrop-blur-md border border-white/40 shadow-xl">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[var(--dark-accent)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    ❤️ Both partners – enter your preferences
                  </h2>
                  <DualDateForm
                    person1={person1}
                    person2={person2}
                    setPerson1={setPerson1}
                    setPerson2={setPerson2}
                    city={dualCity}
                    setCity={setDualCity}
                    onSubmit={handleDualSubmit}
                    loading={dualLoading}
                  />
                  {dualError && <p className="mt-3 text-sm text-red-600 bg-red-50/80 rounded-lg p-2">{dualError}</p>}
                </section>
                {dualLoading && (
                  <div className="rounded-2xl p-8 bg-white/25 backdrop-blur-md border border-white/40 shadow-xl text-center text-[var(--dark-accent)]">
                    <p className="font-medium">Calculating compatibility & creating your plan…</p>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="space-y-6">
                  <ResultCardDual
                    plan={dualPlan}
                    person1Name={mergedPrefs?.person1Name ?? person1.name}
                    person2Name={mergedPrefs?.person2Name ?? person2.name}
                    compatibility={compatibility}
                  />
                </section>
                <section>
                  <div className="rounded-2xl p-6 bg-white/25 backdrop-blur-md border border-white/40 shadow-xl">
                    <MapSection city={dualCity} dateType={mergedPrefs?.dateType} />
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

        <footer className="text-center mt-12 text-sm text-[var(--dark-accent)]/70">
          Made with ❤️ – LoveCraft AI
        </footer>
      </div>
    </div>
  );
}

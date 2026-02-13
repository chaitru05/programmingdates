
import React from 'react';


export default function StartScreen({ onSelectSingle, onSelectDual }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-hidden bg-[var(--bg-primary)]">
      <div className="max-w-6xl w-full flex flex-col items-center z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in-down">
          <h1
            className="text-5xl md:text-7xl font-bold mb-12 text-[var(--dark-accent)] drop-shadow-sm"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            LoveCraft AI
          </h1>
          <p className="text-xl md:text-2xl text-[var(--dark-accent)]/90 italic font-light">
            Plan Your Perfect Date
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full max-w-4xl px-4">
          {/* Single Planner Card */}
          <button
            type="button"
            onClick={onSelectSingle}
            className="group relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center h-[400px] flex flex-col"
          >
            <div className="h-1/2 w-full overflow-hidden relative">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
              <img
                src="/surprice.png"
                alt="Single person planning date"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="h-1/2 p-6 flex flex-col items-center justify-center relative z-20">
              <div className="mb-3 bg-white/80 p-3 rounded-full shadow-sm">
                <span className="text-3xl">💝</span>
              </div>
              <h3
                className="text-2xl font-bold mb-2 text-[var(--dark-accent)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Surprise Proposal
              </h3>
              <p className="text-[var(--dark-accent)]/80 text-sm md:text-base leading-relaxed max-w-xs mx-auto">
                Plan a magical surprise tailored to your partner's unique taste. Use our AI to craft the perfect moment.
              </p>
            </div>
          </button>

          {/* Dual Input Card */}
          <button
            type="button"
            onClick={onSelectDual}
            className="group relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center h-[400px] flex flex-col"
          >
            <div className="h-1/2 w-full overflow-hidden relative">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
              <img
                src="/image.png"
                alt="Romantic couple"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="h-1/2 p-6 flex flex-col items-center justify-center relative z-20">
              <div className="mb-3 bg-white/80 p-3 rounded-full shadow-sm">
                <span className="text-3xl">❤️</span>
              </div>
              <h3
                className="text-2xl font-bold mb-2 text-[var(--dark-accent)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Plan Together
              </h3>
              <p className="text-[var(--dark-accent)]/80 text-sm md:text-base leading-relaxed max-w-xs mx-auto">
                Input both preferences to find your compatibility sweet spot. Perfect for first dates or relationship milestones.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Background Elements for Theme */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-300/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
    </div>
  );
}

